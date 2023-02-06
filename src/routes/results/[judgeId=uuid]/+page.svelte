<script lang="ts">
	import {
		Avatar,
		Button,
		Popover,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead
	} from "flowbite-svelte";
	import FasEllipsis from "~icons/fa6-solid/ellipsis";
	import FasCircleCheck from "~icons/fa6-solid/circle-check";
	import FasEyeSlash from "~icons/fa6-solid/eye-slash";
	import FasRotate from "~icons/fa6-solid/rotate";
	import type { PageData } from "./$types";
	import "$lib/styles/tables.pcss";
	import { page } from "$app/stores";
	import { invalidateAll } from "$app/navigation";
	import toast from "svelte-french-toast";

	export let data: PageData;

	$: tableData = data.tableData;
	$: categories = data.categories;
	$: classes = data.classes;
	$: judgeName = data.judgeName;

	var isReverting = false;
	async function revert(id: number) {
		isReverting = true;
		const res = await fetch(`/ordering/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				judgeId: $page.params.judgeId
			})
		});

		if (res.ok) {
			await invalidateAll();
			toast.success("A véglegesítés sikeresen visszaállítva.");
		} else toast.error("Hiba történt a véglegesítés visszaállítása közben.");
		isReverting = false;
	}
</script>

<svelte:head>
	<title>Eredmények • {judgeName} • UNESCO Szavazás</title>
</svelte:head>

<Table divClass="relative overflow-x-auto rounded-t-lg thin-scrollbar" class="w-full">
	<TableHead>
		<th class="px-3 py-6">
			<div class="flex flex-col items-center gap-2">
				<Avatar
					src="https://api.dicebear.com/5.x/initials/svg?seed={judgeName}&scale=85"
					border
					size="sm"
				/>
				<Span class="text-center normal-case">{judgeName}</Span>
			</div>
		</th>
		{#each categories as { id, name, finalized }}
			<th class="py-3 border-gray-800 border-l text-vertical">
				<div class="flex items-center justify-between gap-2">
					{#if finalized}
						<FasCircleCheck id="finalization-indicator-{id}" class="text-green-500" />
						{#if data.canRevertFinalizations}
							<Popover
								triggeredBy="#finalization-indicator-{id}"
								title="Véglegesítve"
								class="normal-case text-horizontal !border-gray-800"
								placement="bottom"
							>
								<Button
									color="red"
									size="xs"
									class="gap-2"
									disabled={isReverting}
									on:click={() => revert(id)}
								>
									<FasRotate /> Visszaállítás
								</Button>
							</Popover>
						{:else}
							<Popover
								triggeredBy="#finalization-indicator-{id}"
								class="normal-case text-horizontal font-normal"
								placement="bottom"
							>
								Véglegesítve
							</Popover>
						{/if}
					{:else}
							<div/>
					{/if}
					<div class="rotate-[179.9deg]">
						{name}
					</div>
				</div>
			</th>
		{/each}
	</TableHead>
	<TableBody>
		{#each classes as { name, country }, i}
			<TableBodyRow class="border-gray-600 divide-x">
				<TableBodyCell>
					<div class="flex flex-col items-center">
						<div>{name}</div>
						<div class="text-xs">{country}</div>
					</div>
				</TableBodyCell>
				{#each tableData[i] as place}
					<TableBodyCell class="border-gray-700 text-center">
						{#if !place}
							<div class="flex items-center justify-center">
								<FasEllipsis />
							</div>
						{:else if place === "hidden"}
							<div class="flex items-center justify-center">
								<FasEyeSlash />
							</div>
						{:else}
							{place}.
						{/if}
					</TableBodyCell>
				{/each}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
