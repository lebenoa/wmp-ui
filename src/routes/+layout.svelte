<script lang="ts">
    import "../app.css";

    import Play from "$lib/components/icon/play.svelte";
    import Loop from "$lib/components/icon/loop.svelte";
    import Pause from "$lib/components/icon/pause.svelte";
    import Download from "$lib/components/icon/download.svelte";
    import Player from "$lib/components/Player.svelte";

    import { title } from "$lib/store/title";
    import type { Session } from "$lib/types";
    import { queue } from "$lib/store/queue";
    import { player } from "$lib/store/player";
    import { onMount } from "svelte";

    onMount(async () => {
        let response = await fetch("/load-playlist");

        if (response.ok) {
            let data: Session = await response.json();
            queue.setSession(data);
        }
    });
</script>

<svelte:head>
    <title>{$title}</title>
</svelte:head>
<Play />
<Loop />
<Pause />
<Download />

<Player />

<slot></slot>
