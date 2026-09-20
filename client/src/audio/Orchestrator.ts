import type { Shape } from "../types";
import { sampleUrl } from "../utils/shapes";
import type { Engine } from "./Engine";
import { distanceVolume, reverbSend, shapePosition, sizeVolume } from "./spatial";

// turns the editor's shapes into engine voices: one voice per shape.
export class Orchestrator {
	private readonly engine: Engine;

	constructor(engine: Engine) {
		this.engine = engine;
	}

	// resolves once every voice is created (samples decoded).
	async sync(shapes: Shape[]) {
		const ids = new Set(shapes.map((s) => s.id));
		for (const id of this.engine.voiceIds()) {
			if (!ids.has(id)) this.engine.removeVoice(id);
		}
		await Promise.all(
			shapes.map((shape) => {
				const position = shapePosition(shape);
				return this.engine.setVoice(shape.id, {
					sampleUrl: sampleUrl(shape),
					position,
					loudness: sizeVolume(shape),
					volume: distanceVolume(position),
					wet: reverbSend(position),
				});
			}),
		);
	}
}
