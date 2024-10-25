import { writable, type Writable } from "svelte/store";
import type { Track } from "$lib/types";

export const tracks: Writable<Track[]> = writable([]);
