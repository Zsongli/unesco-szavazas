<script lang="ts">
	import {
		Popover,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead
	} from "flowbite-svelte";
	import type { PageData } from "./$types";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";
	import FasAsterisk from "~icons/fa6-solid/asterisk";
	import "$lib/styles/results.pcss";

	export var data: PageData;

	function placementToString(place: number) {
		if (place === 1) return "🥇";
		if (place === 2) return "🥈";
		if (place === 3) return "🥉";
		return `${place}.`;
	}
</script>

<svelte:head>
	<title>Eredmények • Összesítés • UNESCO Szavazás</title>
</svelte:head>

<Table divClass="relative overflow-x-auto rounded-t-lg thin-scrollbar" class="w-full">
	<TableHead>
		<th class="px-3 py-6">
			<div class="flex flex-col items-center justify-center gap-2">
				<FasSquarePollVertical class="text-xl" />
				<div class="flex">
					<Span class="text-center normal-case text-base">Összesítés</Span>
					<FasAsterisk id="summary-asterisk" class="text-[8px]" />
					<Popover class="font-normal normal-case text-xs" title="Figyelem!" placement="right">
						Az összesítésbe kizárólag a véglegesített szavazatok számítanak bele.
					</Popover>
				</div>
			</div>
		</th>
		{#each data.categories as category}
			<th class="py-3 border-gray-800 border-l">
				<div class="flex justify-center">
					<div class="text-vertical rotate-180 ">{category}</div>
				</div>
			</th>
		{/each}
		<th class="py-3 border-gray-800 border-l-2">
			<div class="flex justify-center">
				<div class="text-vertical rotate-180 ">Összesen</div>
			</div>
		</th>
		<th class="py-3 border-gray-800 border-l">
			<div class="flex justify-center">
				<div class="text-vertical rotate-180 ">Helyezés</div>
			</div>
		</th>
	</TableHead>
	<TableBody>
		{#each data.classes as { name, country }, i}
			<TableBodyRow class="border-gray-600 divide-x">
				<TableBodyCell>
					<div class="flex flex-col items-center">
						<div>{name}</div>
						<div class="text-xs">{country}</div>
					</div>
				</TableBodyCell>
				{#each data.tableData[i] as sum}
					<TableBodyCell class="border-gray-700 text-center">{sum}</TableBodyCell>
				{/each}
				<TableBodyCell class="border-gray-700 !border-l-2 text-center">
					{data.scores[i]}
				</TableBodyCell>
				<TableBodyCell class="border-gray-700 text-center">
					{#if data.placements[i] <= 3}
						<Span class="text-xl">{placementToString(data.placements[i])}</Span>
					{:else}
						<Span class="!text-gray-500">{placementToString(data.placements[i])}</Span>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
