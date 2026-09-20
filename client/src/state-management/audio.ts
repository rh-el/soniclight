import { create } from "zustand";

interface AudioState {
	isPlaying: boolean;
	isLoading: boolean;
	setPlaying: (isPlaying: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
	isPlaying: false,
	isLoading: false,
	setPlaying: (isPlaying) => set({ isPlaying }),
	setLoading: (isLoading) => set({ isLoading }),
	reset: () => set({ isPlaying: false, isLoading: false }),
}));
