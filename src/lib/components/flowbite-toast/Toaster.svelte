<script lang="ts">
	import useToaster from 'svelte-french-toast/core/use-toaster';
	import type { DOMToast, ToastOptions, ToastPosition } from 'svelte-french-toast/core/types';
	import ToastWrapper from '$lib/components/flowbite-toast/ToastWrapper.svelte';
	export let reverseOrder = false;
	export let position: ToastPosition = 'top-center';
	export let toastOptions: Omit<ToastOptions, "style" | "className"> | undefined = undefined;
	export let gutter = 8;
	export let containerStyle: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;
	const { toasts, handlers } = useToaster(toastOptions);
	let _toasts: DOMToast[];
	$: _toasts = $toasts.map((toast) => ({
		...toast,
		position: toast.position || position,
		offset: handlers.calculateOffset(toast, $toasts, {
			reverseOrder,
			gutter,
			defaultPosition: position
		})
	}));
</script>

<div
	class="toaster {containerClassName || ''}"
	style={containerStyle}
	on:mouseenter={handlers.startPause}
	on:mouseleave={handlers.endPause}
>
	{#each _toasts as toast (toast.id)}
		<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height)} />
	{/each}
</div>

<style>
	.toaster {
		--default-offset: 16px;
		position: fixed;
		z-index: 9999;
		top: var(--default-offset);
		left: var(--default-offset);
		right: var(--default-offset);
		bottom: var(--default-offset);
		pointer-events: none;
	}
</style>