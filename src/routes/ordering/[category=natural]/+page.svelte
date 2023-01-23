<script lang="ts">
	import { page, navigating } from "$app/stores";
	import type { PageData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";
	import {
		Button,
		Modal,
		Spinner,
		P,
		Span,
		Popover
	} from "flowbite-svelte";
	import OrderableList from "$lib/components/OrderableList.svelte";
	import { fade } from "svelte/transition";
	import { expoOut } from "svelte/easing";
	import FasCircleExclamation from "~icons/fa6-solid/circle-exclamation";
	import FasCircleCheck from "~icons/fa6-solid/circle-check";
	import toast from "svelte-french-toast";
	import { browser } from "$app/environment";

	export let data: PageData;

	$: categoryId = $page.params.category;
	$: categoryName = data.categoryName;
	$: order = data.order;
	$: finalized = data.finalized;

	let isWaiting = false;
	let dataChanged = false;

	let finalizeConfirmationOpen = false;

	function orderChanged(order: PageData["order"]) {
		if (finalized || !browser || $navigating != null) return;
		dataChanged = true;
		if (!isWaiting) update();
	}

	$: orderChanged(order);
	
	async function update() {
		isWaiting = true;
		while (dataChanged) {
			dataChanged = false;
			let res = await fetch(`/ordering/${categoryId}`, {
				method: "POST",
				body: JSON.stringify(order.map((x) => x.id))
			});
			let data = await res.json();
			console.log(data);
		}
		isWaiting = false;
	}

	var isSubmitting = false;
	const submitFinalize: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result, update }) => {
			await update();
			if (result.type != "redirect" && result.type != "error" && result.data?.message) {
				if (result.type === "failure") toast.error(result.data.message);
				else if (result.type === "success") toast.success(result.data.message);
			}
			isSubmitting = false;
			finalizeConfirmationOpen = false;
		};
	};
</script>

<svelte:head>
	<title>Sorrend • {categoryName} • Unesco Szavazás</title>
</svelte:head>

<OrderableList
	class="grow"
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
</OrderableList>
<Popover triggeredBy="#btn-finalize" placement="left" class="text-xs"
	>Szavazat véglegesítése</Popover
>

{#if finalized}
	<div
		class="absolute top-0 left-0 w-full h-full bg-opacity-25 bg-black backdrop-blur-[1px] flex items-center justify-center gap-4 text-8xl rounded-md"
		in:fade={{
			duration: $navigating == null ? 500 : 0,
			delay: $navigating == null ? 250 : 0,
			easing: expoOut
		}}
	>
		<FasCircleCheck class="dark:text-green-400 text-green-600" />
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
			<form
				slot="footer"
				action="/ordering/{categoryId}/finalize"
				method="post"
				use:enhance={submitFinalize}
				class="flex w-full place-content-center gap-2"
			>
				<Button color="red" type="submit" disabled={isSubmitting} class="gap-2">
					{#if isSubmitting}
						<Spinner color="white" size="3" />
					{/if}
					Véglegesítés
				</Button>
				<Button
					color="alternative"
					type="button"
					on:click={() => (finalizeConfirmationOpen = false)}
					disabled={isSubmitting}>Mégse</Button
				>
			</form>
		</Modal>
	</div>
{/if}

<!-- {#if isWaiting}
	<div class="flex flex-col items-center gap-1 p-1">
		<div>Mentés...</div>
		<Spinner color="gray" size="4" />
	</div>
{/if} -->
