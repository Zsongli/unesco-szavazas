<script lang="ts">
	import ToastIcon from "svelte-french-toast/components/ToastIcon.svelte";
	import type { Toast, ToastPosition, ToastType } from "svelte-french-toast/core/types";
	import { prefersReducedMotion } from "svelte-french-toast/core/utils";
	import { Toast as FBToast } from "flowbite-svelte";
	import toast_ from "svelte-french-toast";

	export let toast: Toast;
	export let position: ToastPosition | undefined = undefined;
	export let style = "";

	let factor: number;
	let animation: string;
	$: {
		const top = (toast.position || position || "top-center").includes("top");
		factor = top ? 1 : -1;
		const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
		animation = toast.visible ? enter : exit;
	}

	var open: boolean = true;

	$: !open && dismiss();

	function dismiss() {
		toast_.dismiss(toast.id);
	}

	const typeColor: Record<ToastType, "green" | "red" | "none"> = {
		success: "green",
		error: "red",
		blank: "none",
		loading: "none",
		custom: "none"
	};
</script>

<div
	class="{toast.height ? animation : 'transparent'} {toast.className || ''}"
	style="{style}; {toast.style}"
	style:--factor={factor}
>
	<FBToast bind:open color={typeColor[toast.type]}>
		<ToastIcon {toast} slot="icon" />
		<span>
			{toast.message}
		</span>
	</FBToast>
</div>

<style>
	@keyframes enterAnimation {
		0% {
			transform: translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);
			opacity: 0.5;
		}
		100% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
	}
	@keyframes exitAnimation {
		0% {
			transform: translate3d(0, 0, -1px) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);
			opacity: 0;
		}
	}
	@keyframes fadeInAnimation {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes fadeOutAnimation {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	.transparent {
		opacity: 0;
	}
	.enter {
		animation: enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
	}
	.exit {
		animation: exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
	}
	.fadeIn {
		animation: fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
	}
	.fadeOut {
		animation: fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
	}
</style>
