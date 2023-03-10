<script lang="ts">
	import { page, navigating } from "$app/stores";
	import type { PageData } from "./$types";
	import { Button, Modal, Spinner, P, Span, Popover } from "flowbite-svelte";
	import OrderableList from "$lib/components/OrderableList.svelte";
	import { fade } from "svelte/transition";
	import { expoOut } from "svelte/easing";
	import FasCircleExclamation from "~icons/fa6-solid/circle-exclamation";
	import FasCircleQuestion from "~icons/fa6-solid/circle-question";
	import FasCircleCheck from "~icons/fa6-solid/circle-check";
	import CustomGoldMedal from "~icons/custom/gold-medal";
	import CustomSilverMedal from "~icons/custom/silver-medal";
	import CustomBronzeMedal from "~icons/custom/bronze-medal";
	import toast from "svelte-french-toast";
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";

	export let data: PageData;

	$: categoryId = Number($page.params.category);
	$: categoryName = data.categoryName;
	$: order = data.order;
	$: finalized = data.finalized;

	let isWaiting = false;
	let dataChanged = false;

	let finalizeConfirmationOpen = false;

	function orderChanged(order: PageData["order"]) {
		if (isWatingForFinalizeSubmitting || finalized || !browser || $navigating != null) return;
		dataChanged = true;
		if (!isWaiting) update();
	}

	$: orderChanged(order); // FIXME: currently runs on initial page load

	async function update() {
		isWaiting = true;
		while (dataChanged) {
			dataChanged = false;
			await postOrdering(false);
		}
		isWaiting = false;
	}
	async function finalize() {
		isWatingForFinalizeSubmitting = true;
		await postOrdering(true);
		await invalidateAll(); // need this so the layout updates as well
		toast.success("A kategória véglegesítése sikeresen megtörtént.");
		isWatingForFinalizeSubmitting = false;
		finalizeConfirmationOpen = false;
	}
	async function postOrdering(finalize: boolean) {
		let res = await fetch(`/ordering/${categoryId}`, {
			method: "POST",
			body: JSON.stringify({
				finalize: finalize,
				ordering: order.map((x) => x.id)
			})
		});
		await res.json();
	}

	var isWatingForFinalizeSubmitting = false;
</script>

<svelte:head>
	<title>Sorrend • {categoryName} • UNESCO Szavazás</title>
</svelte:head>

<OrderableList
	class="grow rounded-t-md w-full"
	bind:items={order}
	display={(entry) => ({ Osztály: entry.name, Ország: entry.country })}
>
	<svelte:fragment slot="grip-col-header">
		<Button
			color="green"
			outline
			class="!p-2"
			size="xs"
			disabled={finalized}
			on:click={() => (finalizeConfirmationOpen = true)}
			id="btn-finalize"
		>
			<FasCircleCheck />
		</Button>
	</svelte:fragment>
	<div class="text-center" slot="index-col-header">Helyezés</div>
	<div class="flex items-center justify-center text-center max-h-0" slot="index-col" let:index>
		{#if index === 0}
			<CustomGoldMedal class="text-3xl" />
		{:else if index === 1}
			<CustomSilverMedal class="text-3xl" />
		{:else if index === 2}
			<CustomBronzeMedal class="text-3xl" />
		{:else}
			<span class="text-gray-500">{index + 1}.</span>
		{/if}
	</div>
</OrderableList>

<Popover triggeredBy="#btn-finalize" placement="left" class="text-xs">
	Szavazat véglegesítése
</Popover>

{#if finalized}
	<div
		class="absolute top-0 left-0 w-full h-full bg-opacity-25 bg-black backdrop-blur-[1px] flex flex-col items-center justify-center gap-4 rounded-md"
		in:fade={{
			duration: $navigating == null ? 500 : 0,
			delay: $navigating == null ? 250 : 0,
			easing: expoOut
		}}
	>
		<FasCircleCheck class="dark:text-green-400 text-green-600 text-8xl opacity-80" />
		<Span class="text-3xl">Véglegesítve</Span>
		<FasCircleQuestion id="finalized-help" class="absolute bottom-4 right-4 hover:text-gray-400" />
		<Popover
			triggeredBy="#finalized-help"
			placement="left"
			class="text-xs max-w-xs"
			title="Véletlen volt?"
		>
			A visszavonáshoz keress meg egy adminisztrátort!
		</Popover>
	</div>
{/if}

{#if finalizeConfirmationOpen}
	<div transition:fade={{ duration: 50 }}>
		<Modal
			title="Véglegesítés megerősítése"
			size="sm"
			bind:open={finalizeConfirmationOpen}
			permanent
		>
			<div class="flex items-center jutify-between w-full">
				<FasCircleExclamation class="text-7xl text-center mx-4" />
				<div class="ml-6">
					<P class="text-gray-500 dark:text-gray-400">
						A véglegesítés után a(z) <Span>{categoryName}</Span> kategória sorrendjén nem változtathatsz
						majd többet.
					</P>
				</div>
			</div>
			<P size="xl" align="center">Biztosan véglegesíted a jelenlegi sorrendet?</P>
			<div slot="footer" class="flex w-full place-content-center gap-2">
				<Button
					color="red"
					on:click={() => finalize()}
					disabled={isWatingForFinalizeSubmitting}
					class="gap-2"
				>
					{#if isWatingForFinalizeSubmitting}
						<Spinner color="white" size="3" />
					{/if}
					Véglegesítés
				</Button>
				<Button
					color="alternative"
					type="button"
					on:click={() => (finalizeConfirmationOpen = false)}
					disabled={isWatingForFinalizeSubmitting}>Mégse</Button
				>
			</div>
		</Modal>
	</div>
{/if}
