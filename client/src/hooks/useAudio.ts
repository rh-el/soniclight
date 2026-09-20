import { useCallback, useEffect, useRef } from "react";
import { Engine } from "../audio/Engine";
import { Orchestrator } from "../audio/Orchestrator";
import { useAudioStore } from "../state-management/audio";
import { useEditorStore } from "../state-management/editor";

// owns the audio engine of the current page: play/pause, and keeps voices in sync with the shapes.
export function useAudio() {
	const audio = useRef<{ engine: Engine; orchestrator: Orchestrator } | null>(null);
	const busy = useRef(false);

	useEffect(() => {
		const unsubscribe = useEditorStore.subscribe((state, prev) => {
			if (state.shapes === prev.shapes) return;
			audio.current?.orchestrator.sync(state.shapes).catch((err) => console.error(err));
		});
		return () => {
			unsubscribe();
			audio.current?.engine.dispose();
			audio.current = null;
			useAudioStore.getState().reset();
		};
	}, []);

	const toggle = useCallback(async () => {
		if (busy.current) return;
		busy.current = true;
		const store = useAudioStore.getState();
		try {
			if (store.isPlaying) {
				await audio.current?.engine.pause();
				store.setPlaying(false);
				return;
			}
			store.setLoading(true);
			if (!audio.current) {
				const engine = new Engine();
				audio.current = { engine, orchestrator: new Orchestrator(engine) };
			}
			audio.current.engine.start();
			await audio.current.orchestrator.sync(useEditorStore.getState().shapes);
			await audio.current.engine.play();
			store.setPlaying(true);
		} catch (err) {
			console.error(err);
			audio.current?.engine.dispose();
			audio.current = null;
			store.setPlaying(false);
		} finally {
			store.setLoading(false);
			busy.current = false;
		}
	}, []);

	return { toggle };
}
