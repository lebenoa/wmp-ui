import { writable } from "svelte/store";
import { Howl } from "howler";
import { queue } from "./queue";
import { addToHistory } from "./history";
import type { Player, Track } from "$lib/types";
import { title } from "./title";

export const player = createStore({
	title: null,
	artist: "No Artist",
	thumbnail: null,
	duration: 0,
	isPlaying: false,
	isLooping: false
});

export const currentTime = writable(0);

let sound: Howl;
let activeInterval: any;

function createStore(value: Player) {
	const { subscribe, update } = writable(value);

	function playAudio(url: string, info: Track, seekTo?: number) {
		if (sound) sound.unload();

		sound = new Howl({
			src: url,
			html5: true,
			format: ["mp3"],
			loop: value.isLooping
		});

		sound.once("load", async () => {
			sound.play();

			title.set(`${info.title} | ${info.artist} | Music Player`);

			update((val) => {
				val.title = info.title;
				val.artist = info.artist;
				val.thumbnail = info.thumbnail;
				val.duration = sound.duration();
				val.isPlaying = true;

				return val;
			});

			if (activeInterval) clearInterval(activeInterval);
			activeInterval = setInterval(() => {
				if (!sound.playing()) {
					return;
				}

				const elapsed = sound.seek();
				currentTime.set(elapsed);
			}, 500);

			if (url.startsWith("/m/")) {
				addToHistory(info);
			}

			if (seekTo) {
				sound.play();
				sound.seek(seekTo);
				sound.pause();
				currentTime.set(seekTo);
			} else {
				currentTime.set(0);
			}
		});

		sound.once("end", () => {
			// Hack to make timer sync.
			currentTime.set(value.duration);
			update((val) => {
				val.isPlaying = false;
				return val;
			})
			if (!value.isLooping) queue.next();
		});

		sound.on("pause", () => {
			update((val) => {
				val.isPlaying = false;
				return val;
			});
		});

		sound.on("play", () => {
			update((val) => {
				val.isPlaying = true;
				return val;
			});
		});
	}

	function getCurrentTime(): number {
		if (sound) {
			return sound.seek();
		} else {
			return 0;
		}
	}

	function seek(time: number) {
		if (sound) {
			sound.seek(time);
		}
	}

	function pause() {
		if (!sound) return;

		sound.pause();
	}

	function togglePlayPause() {
		if (!sound) return;

		if (sound.playing()) {
			sound.pause();
		} else {
			sound.play();
		}
	}

	function toggleLoop() {
		update((val) => {
			val.isLooping = !val.isLooping;
			if (sound) {
				sound.loop(val.isLooping);
			}

			return val;
		});
	}

	function isPlaying() {
		return sound ? sound.playing() : false;
	}

	function stop() {
		if (sound) {
			sound.stop();
		}
	}

	return {
		subscribe,
		playAudio,
		currentTime: getCurrentTime,
		seek,
		pause,
		togglePlayPause,
		toggleLoop,
		stop,
		isPlaying
	};
}
