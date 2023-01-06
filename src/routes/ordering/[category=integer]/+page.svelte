<script lang="ts">
	import { page } from "$app/stores";
	import { Button, Modal, Spinner } from "flowbite-svelte";
	import { flip } from "svelte/animate";
	import FasArrowDownLong from "~icons/fa6-solid/arrow-down-long";
	import FasArrowUpLong from "~icons/fa6-solid/arrow-up-long";
	import FasArrowLeftLong from "~icons/fa6-solid/arrow-left-long";
	import FasArrowRightLong from "~icons/fa6-solid/arrow-right-long";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: categoryId = $page.params.category;
	$: categoryName = data.categoryName;
	$: order = data.order;
	$: finalized = data.finalized;

	let isWaiting = false;
	let dataChanged = false;

	let finalizeConfirmationOpen = false;

	function trySwapAndUpdate(i: number, j: number) {
		if (finalized) return;
		if (i < 0 || j < 0 || i >= order.length || j >= order.length) return;
		dataChanged = true;
		[order[i], order[j]] = [order[j], order[i]];
		if (!isWaiting) update();
	}
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
	async function finalize() {
		finalized = true;
		await fetch(`/ordering/${categoryId}/finalize`, { method: "POST" });
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-2 bg-slate-800">
	<div class="flex">
		{#if data.navigationInfo.prevCategory}
			<a href={`/ordering/${data.navigationInfo.prevCategory.id}`}>
				<div class="flex items-center gap-2">
					<FasArrowLeftLong />
					<div>{data.navigationInfo.prevCategory.name}</div>
				</div>
			</a>
		{/if}
		<div class="grow" />
		{#if data.navigationInfo.nextCategory}
			<a href={`/ordering/${data.navigationInfo.nextCategory.id}`}>
				<div class="flex items-center gap-2">
					<div>{data.navigationInfo.nextCategory.name}</div>
					<FasArrowRightLong />
				</div>
			</a>
		{/if}
	</div>
	<div class="text-center text-2xl my-2">Sorrend - {categoryName}</div>

	<div class="py-2">
		{#each order as el, i (el.id)}
			<div class="flex bg-slate-600 border border-orange-500" animate:flip>
				<div class="pr-4">{i + 1}.</div>
				<div class="grow">{el.name} ({el.country})</div>
				<div class="flex items-center">
					<button
						on:click={() => trySwapAndUpdate(i, i + 1)}
						disabled={finalized || i == order.length - 1}
						class="text-lime-600 disabled:text-red-600"
					>
						<FasArrowDownLong />
					</button>
					<button
						on:click={() => trySwapAndUpdate(i - 1, i)}
						disabled={finalized || i == 0}
						class="text-lime-600 disabled:text-red-600"
					>
						<FasArrowUpLong />
					</button>
				</div>
			</div>
		{/each}
	</div>
	<div class="mx-auto w-fit">
		{#if finalized}
			<div>Véglegesítve</div>
		{:else}
			<Button on:click={() => (finalizeConfirmationOpen = true)}>Véglegesítés</Button>
		{/if}
	</div>
</div>
<Modal title="Biztos benne?" bind:open={finalizeConfirmationOpen} autoclose>
	<p class="text-gray-500 dark:text-gray-400">Biztosan véglegesíti a jelenlegi rendezést?</p>
	<p class="text-gray-500 dark:text-gray-400">
		A véglegesítés után a "{categoryName}" nevű kategória sorrendjén nem változtathat többet. A
		többi, még nem véglegesített kategória sorrendjén még fog tudni változtatni.
	</p>
	<svelte:fragment slot="footer">
		<Button on:click={() => finalize()}>Véglegesítés</Button>
		<Button color="alternative">Mégse</Button>
	</svelte:fragment>
</Modal>

{#if isWaiting}
	<div class="flex flex-col items-center gap-1 p-1">
		<div>Mentés...</div>
		<Spinner />
	</div>
{/if}
