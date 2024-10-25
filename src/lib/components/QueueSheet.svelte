<script lang="ts">
    export let manualTrigger = false;
    export let open = false;

    import { Button } from "./ui/button";
    import * as Sheet from "./ui/sheet";

    import { queue, queueIndex } from "$lib/store/queue";
    import { player } from "$lib/store/player";
    import { scrollIf } from "$lib/scrollToMe";
    import Trash from "./icon/trash.svelte";
</script>

<Sheet.Root bind:open>
    {#if !manualTrigger}
        <Sheet.Trigger asChild let:builder>
            <Button builders={[builder]} class="ml-2" on:click={() => {}} title="View Queue">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                >
                    <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
                    <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path
                        d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"
                    />
                    <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" /></svg
                >
                Queue
            </Button>
        </Sheet.Trigger>
    {/if}
    <Sheet.Content class="flex flex-col p-4">
        <Sheet.Header>
            <Sheet.Title>Queue</Sheet.Title>
            <Sheet.Description>
                <span class="font-bold text-primary">{$queueIndex + 1}</span> /
                <span class="font-bold text-primary">{$queue.length}</span> items in queue!
            </Sheet.Description>
        </Sheet.Header>
        <div class="flex h-full flex-col overflow-y-auto">
            {#each $queue as track, idx}
                <button
                    on:click={() => {
                        queue.seektoIndex(idx);
                    }}
                    use:scrollIf={track.title == $player.title}
                    class="flex flex-row border !bg-opacity-50 transition-colors active:bg-primary lg:hover:bg-primary {track.title ==
                    $player.title
                        ? 'border-primary bg-secondary'
                        : 'border-transparent'}"
                >
                    <div
                        class="mr-2 flex aspect-square h-auto w-16 items-center justify-center bg-black"
                    >
                        <img src={track.thumbnail} alt={track.title} />
                    </div>
                    <div
                        class="flex h-full w-full flex-col justify-around overflow-x-auto text-start"
                    >
                        <h3 class="text-nowrap font-bold">{track.title}</h3>
                        <p class="text-nowrap text-muted-foreground">{track.artist}</p>
                    </div>
                </button>
            {/each}
        </div>
        <Sheet.Footer class="m-0">
            <div class="mb-2 w-full">
                <Button class="w-full" variant="destructive" on:click={() => queue.clearQueue()}>
                    <Trash />
                    Clear
                </Button>
            </div>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
