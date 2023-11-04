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
	import CustomGoldMedal from "~icons/custom/gold-medal";
	import CustomSilverMedal from "~icons/custom/silver-medal";
	import CustomBronzeMedal from "~icons/custom/bronze-medal";
	import "$lib/styles/tables.pcss";

	export var data: PageData;
</script>

<svelte:head>
	<title>Eredmények • Összesítés • Gólyabál Szavazás</title>
</svelte:head>

<Table divClass="relative overflow-x-auto rounded-t-lg thin-scrollbar" class="w-full">
	<TableHead>
		<th class="px-3 py-6">
			<div class="flex flex-col items-center justify-center gap-2">
				<FasSquarePollVertical class="text-xl" />
				<div class="flex">
					<Span class="text-center normal-case text-base">Összesítés</Span>
					<FasAsterisk id="summary-asterisk" class="text-[0.4rem]" />
					<Popover class="font-normal normal-case text-xs" title="Figyelem!" placement="right">
						Az összesítésbe kizárólag a véglegesített szavazatok számítanak bele.
					</Popover>
				</div>
			</div>
		</th>
		{#each data.categories as category}
			<th class="py-3 border-gray-800 border-l align-bottom">
				<div class="flex justify-center">
					<div class="text-vertical rotate-[179.9deg]">{category}</div>
				</div>
			</th>
		{/each}
		<th class="py-3 border-gray-800 border-l align-bottom">
			<div class="flex justify-center">
				<div class="text-vertical rotate-[179.9deg]">Összesen</div>
			</div>
		</th>
		<th class="py-3 border-gray-800 border-l align-bottom">
			<div class="flex justify-center">
				<div class="text-vertical rotate-[179.9deg]">Helyezés</div>
			</div>
		</th>
	</TableHead>
	<TableBody>
		{#each data.classes as { name }, i}
			<TableBodyRow class="border-gray-600 divide-x">
				<TableBodyCell>
					<div class="flex flex-col items-center">
						<div>{name}</div>
					</div>
				</TableBodyCell>
				{#each data.tableData[i] as sum}
					<TableBodyCell class="border-gray-700 text-center">{sum}</TableBodyCell>
				{/each}
				<TableBodyCell class="border-gray-700 !border-l-2 text-center">
					{data.scores[i]}
				</TableBodyCell>
				<TableBodyCell class="border-gray-700 text-center !px-4">
					{@const placement = data.placements[i]}
					{#if placement === 1}
						<CustomGoldMedal class="text-3xl" />
					{:else if placement === 2}
						<CustomSilverMedal class="text-3xl" />
					{:else if placement === 3}
						<CustomBronzeMedal class="text-3xl" />
					{:else}
						<Span class="!text-gray-500">{placement}.</Span>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
