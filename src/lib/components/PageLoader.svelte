<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { navigating } from "$app/stores";
	import { Heading, Spinner } from "flowbite-svelte";
	export var showAfter: number = 500;
	export var fadeInDuration: number = 100;
	export var fadeOutDuration: number = 50;
	export var message: string = "Loading...";
	var show = false;
	onMount(() => {
		setTimeout(() => {
			show = true;
		}, showAfter);
	}); // so it doesn't show up on fast loads
</script>

{#if show && $navigating != null}
	<div
		class="fixed w-screen h-screen bg-gray-900 z-50"
		in:fade={{ duration: fadeInDuration }}
		out:fade={{ duration: fadeOutDuration }}
	>
		<div
			class="flex items-center justify-center gap-5 text-center w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
		>
			<Spinner color="blue" size="8" />
			<Heading tag="h3" class="w-fit -translate-y-[3px]">{message}</Heading>
		</div>
	</div>
{/if}
