import { writable, type Writable, type Updater } from "svelte/store";
import { browser } from "$app/environment";
import { Howler } from "howler";

type Settings = {
    volume: number;
    localFileLayout: "list" | "grid";
    history_open: boolean;
};

const KEY = "settings";
const DEFAULT_SETTINGS: Settings = {
    volume: 0.2,
    localFileLayout: "list",
    history_open: true
};

export const settings: Writable<Settings> = createStore();

function createStore() {
    let cval = getSettings();
    Howler.volume(cval.volume);
    const { subscribe, set, update } = writable(cval);

    return {
        subscribe,
        set: (value: Settings) => {
            set(value);
            Howler.volume(cval.volume);
            localStorage.setItem(KEY, JSON.stringify(cval));
        },
        update: (fn: Updater<Settings>) => {
            update(fn);
            Howler.volume(cval.volume);
            localStorage.setItem(KEY, JSON.stringify(cval));
        }
    };
}

function getSettings(): Settings {
    if (!browser) {
        return DEFAULT_SETTINGS;
    }

    const settings = localStorage.getItem(KEY);
    if (settings) {
        const store = JSON.parse(settings);
        if (Object.keys(store).length < Object.keys(DEFAULT_SETTINGS).length) {
            return DEFAULT_SETTINGS;
        }
        return store;
    } else {
        return DEFAULT_SETTINGS;
    }
}
