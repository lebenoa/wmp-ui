<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import LocalFile from "./LocalFile.svelte";
    import SearchOnline from "./SearchOnline.svelte";
    import Download from "./Download.svelte";

    let tabs = [
        { value: "localfile", label: "Local Files" },
        { value: "searchonline", label: "Search Online" },
        { value: "download", label: "Download" }
    ];

    let active = tabs[0].value;
</script>

<Tabs.Root bind:value={active} class="min-h-full">
    <Tabs.List class="-z-50 h-[44px] w-full border-b border-b-primary bg-primary-foreground p-0">
        {#each tabs as tab}
            <Tabs.Trigger
                class="z-10 h-[45px] w-full border border-b-0 {active == tab.value
                    ? 'border-primary'
                    : 'border-transparent'}"
                value={tab.value}
            >
                {tab.label}
            </Tabs.Trigger>
        {/each}
    </Tabs.List>
    <div class="size-full py-2">
        <Tabs.Content value="localfile">
            <LocalFile />
        </Tabs.Content>
        <Tabs.Content value="searchonline">
            <SearchOnline />
        </Tabs.Content>
        <Tabs.Content value="download">
            <Download />
        </Tabs.Content>
    </div>
</Tabs.Root>
