<script lang="ts">
    export let data: Record<string, Track[]>;
    export let searchTerm: string = "";

    import type { Track } from "$lib/types";
    import { queue } from "$lib/store/queue";
    import { settings } from "$lib/store/settings";
    import { flyAndScale } from "$lib/utils";
    import { fade } from "svelte/transition";

    import ImageContainer from "./ImageContainer.svelte";

    interface Filtered extends Track {
        displayTitle: string | undefined;
        displayArtist: string | undefined;
    }

    // @ts-ignore
    let displayData: Record<string, Filtered[]> = data;

    $: if (searchTerm != "") {
        const filtered: Record<string, Filtered[]> = {};
        console.log(searchTerm);

        for (let artist of Object.keys(data)) {
            console.log(artist);
            if (artist.includes(searchTerm.toUpperCase())) {
                filtered[artist] = data[artist];
            }
        }

        displayData = filtered;
    } else {
        // @ts-ignore
        displayData = data;
    }

    let containerStyle = "";
    let imgContainerStyle = "";
    let buttonStyle = "";
    let textContainerStyle = "";
    let textStyle = "";

    $: if ($settings.localFileLayout === "list") {
        containerStyle = "flex h-full flex-col overflow-auto";
        imgContainerStyle = "mr-2 w-16";
        buttonStyle = "grid grid-cols-[auto_1fr]";
        textContainerStyle = "text-start";
        textStyle = " overflow-hidden text-ellipsis whitespace-nowrap";
    } else {
        // Defulat to grid
        containerStyle =
            "grid h-full grid-cols-3 overflow-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";
        imgContainerStyle = "mb-2";
        buttonStyle = "flex flex-col";
        textContainerStyle = "";
        textStyle = "";
    }
</script>

{#each Object.entries(displayData) as [artist, files]}
    <h2 class="text-xl">{artist}</h2>
    <div transition:fade class={containerStyle}>
        {#each files as file}
            <button
                class="relative w-full cursor-pointer {buttonStyle} items-center p-1 transition-all active:bg-secondary lg:hover:bg-secondary"
                on:click={async () => {
                    queue.addToQueue({ ...file, url: `/m/${file.filename}` });
                }}
                in:flyAndScale={{ y: 20, delay: 200, duration: 200 }}
                out:flyAndScale={{ y: 20, duration: 200 }}
            >
                <!-- <div
                class="flex aspect-square items-center justify-center bg-black {imgContainerStyle}"
            >
                <img class="w-full" src={file.thumbnail ?? "/wide-idle.png"} alt={file.title} />
            </div> -->
                <ImageContainer CLASS={imgContainerStyle} src={file.thumbnail} alt={file.title} />
                <div class={textContainerStyle}>
                    <h1 class="w-full text-xl{textStyle}">
                        {@html file.displayTitle ?? file.title}
                    </h1>
                    <h2 class="w-full text-muted-foreground{textStyle}">
                        {@html file.displayArtist ?? file.artist}
                    </h2>
                </div>
            </button>
        {/each}
    </div>
{/each}
