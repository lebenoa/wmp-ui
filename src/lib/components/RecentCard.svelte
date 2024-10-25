<script lang="ts">
    import { addToHistory } from "$lib/store/history";

    export let info: Track;

    import { player, type Track } from "$lib/store/player";

    import { scale } from "svelte/transition";
</script>

<button
    class="flex flex-col p-1 transition-colors active:bg-secondary lg:hover:bg-secondary"
    on:click={async () => {
        player.playAudio(`/m/${info.filename}`, info);
        addToHistory(info);
    }}
    in:scale
>
    <div
        class="mx-auto mb-1 flex aspect-square size-40 items-center justify-center bg-black lg:size-60"
    >
        <img class="w-full" src={info.thumbnail ?? "/idle.png"} alt="{info.title} cover" />
    </div>
    <div class="w-full text-center">
        <h3 class="lg:text-xl">{info.title}</h3>
        <p class="text-muted-foreground">{info.artist}</p>
    </div>
</button>
