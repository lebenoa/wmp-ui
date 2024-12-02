import { writable, type Writable } from "svelte/store";
import type { Track } from "$lib/types";

export const groupByArtist: Writable<Record<string, Track[]>> = writable({});
