import { FADE_MS, IMPULSE_URL } from "./constants";
import type { Position } from "./spatial";

export interface VoiceParams {
	sampleUrl: string;
	position: Position;
	loudness: number;
	volume: number;
	wet: number;
}

interface Voice {
	source: AudioBufferSourceNode;
	gain: GainNode;
	loudness: GainNode;
	distance: GainNode;
	panner: PannerNode;
	send: GainNode;
}

const SMOOTHING = 0.1;
const fadeSeconds = FADE_MS / 1000;

export class Engine {
	private context: AudioContext | null = null;
	private master: GainNode | null = null;
	private convolver: ConvolverNode | null = null;
	private impulseLoaded: Promise<void> = Promise.resolve();
	private buffers = new Map<string, Promise<AudioBuffer>>();
	private voices = new Map<string, Voice>();
	// latest wanted params per voice, so a voice still decoding picks up later edits or removal.
	private wanted = new Map<string, VoiceParams>();

	// must be called from a user gesture (autoplay rule). The master starts silent.
	start() {
		if (this.context) return;
		const context = new AudioContext();
		const master = context.createGain();
		master.gain.value = 0;
		master.connect(context.destination);
		const convolver = context.createConvolver();
		convolver.connect(master);
		this.context = context;
		this.master = master;
		this.convolver = convolver;
		this.impulseLoaded = this.loadBuffer(IMPULSE_URL).then((impulse) => {
			convolver.buffer = impulse;
		});
	}

	async play() {
		if (!this.context || !this.master) return;
		await this.impulseLoaded;
		await this.context.resume();
		this.fade(this.master.gain, 1);
	}

	async pause() {
		if (!this.context || !this.master) return;
		this.fade(this.master.gain, 0);
		await new Promise((resolve) => setTimeout(resolve, FADE_MS));
		await this.context.suspend();
	}

	voiceIds() {
		return [...this.wanted.keys()];
	}

	async setVoice(id: string, params: VoiceParams) {
		this.wanted.set(id, params);
		const voice = this.voices.get(id);
		if (voice) {
			this.update(voice, params);
			return;
		}
		const buffer = await this.loadBuffer(params.sampleUrl);
		if (!this.context || this.voices.has(id)) return;
		const latest = this.wanted.get(id);
		if (!latest) return;
		this.create(id, buffer, latest);
	}

	removeVoice(id: string) {
		this.wanted.delete(id);
		const voice = this.voices.get(id);
		if (!voice || !this.context) return;
		this.voices.delete(id);
		this.fade(voice.gain.gain, 0);
		setTimeout(() => {
			voice.source.stop();
			voice.source.disconnect();
			voice.gain.disconnect();
			voice.loudness.disconnect();
			voice.distance.disconnect();
			voice.panner.disconnect();
			voice.send.disconnect();
		}, FADE_MS + 50);
	}

	dispose() {
		this.voices.clear();
		this.wanted.clear();
		this.buffers.clear();
		void this.context?.close();
		this.context = null;
		this.master = null;
		this.convolver = null;
	}

	private create(id: string, buffer: AudioBuffer, params: VoiceParams) {
		const context = this.context!;
		const source = context.createBufferSource();
		source.buffer = buffer;
		source.loop = true;

		const gain = context.createGain();
		gain.gain.value = 0;

		const panner = context.createPanner();
		panner.panningModel = "HRTF";
		// direction only: volume by distance is the `distance` gain (custom curve, see spatial.ts).
		panner.rolloffFactor = 0;
		panner.positionX.value = params.position.x;
		panner.positionY.value = params.position.y;
		panner.positionZ.value = params.position.z;

		const loudness = context.createGain();
		loudness.gain.value = params.loudness;

		const distance = context.createGain();
		distance.gain.value = params.volume;

		const send = context.createGain();
		send.gain.value = params.wet;

		source.connect(gain);
		// size scales the whole voice; distance only scales the dry path, the reverb send has its own level.
		gain.connect(loudness);
		loudness.connect(distance);
		distance.connect(panner);
		panner.connect(this.master!);
		loudness.connect(send);
		send.connect(this.convolver!);
		source.start();
		this.fade(gain.gain, 1);

		this.voices.set(id, { source, gain, loudness, distance, panner, send });
	}

	private update(voice: Voice, { position, loudness, volume, wet }: VoiceParams) {
		const now = this.context!.currentTime;
		voice.panner.positionX.setTargetAtTime(position.x, now, SMOOTHING);
		voice.panner.positionY.setTargetAtTime(position.y, now, SMOOTHING);
		voice.panner.positionZ.setTargetAtTime(position.z, now, SMOOTHING);
		voice.loudness.gain.setTargetAtTime(loudness, now, SMOOTHING);
		voice.distance.gain.setTargetAtTime(volume, now, SMOOTHING);
		voice.send.gain.setTargetAtTime(wet, now, SMOOTHING);
	}

	private fade(param: AudioParam, value: number) {
		const now = this.context!.currentTime;
		param.cancelScheduledValues(now);
		param.setValueAtTime(param.value, now);
		param.linearRampToValueAtTime(value, now + fadeSeconds);
	}

	private loadBuffer(url: string) {
		let buffer = this.buffers.get(url);
		if (!buffer) {
			const context = this.context!;
			buffer = fetch(url)
				.then((res) => {
					if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
					return res.arrayBuffer();
				})
				.then((data) => context.decodeAudioData(data));
			buffer.catch(() => this.buffers.delete(url));
			this.buffers.set(url, buffer);
		}
		return buffer;
	}
}
