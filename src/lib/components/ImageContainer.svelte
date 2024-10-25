<script lang="ts">
    export let src: string | undefined | null;
    export let alt: string = "";
    export let CLASS: string = "";
</script>

<div class="flex aspect-square items-center justify-center bg-black {CLASS}">
    <img class="w-full" src={src ? src : "/idle.png"} {alt} on:error={() => (src = "/idle.png")} />
</div>
