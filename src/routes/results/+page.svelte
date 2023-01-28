<script lang="ts">
	import { Span, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";

	export var data: PageData;
</script>

<svelte:head>
	<title>Eredmények • Összesítés • UNESCO Szavazás</title>
</svelte:head>

<Table divClass="relative overflow-x-auto rounded-t-lg" class="w-full">
	<TableHead>
		<th class="px-3 py-6 flex flex-col items-center justify-center gap-2">
			<FasSquarePollVertical class="text-base" />
			<Span class="text-center normal-case">Összesítés</Span>
		</th>
		{#each data.categories as category}
			<th class="py-3 text-vertical rotate-[179.9deg] border-gray-800 border-l">{category}</th>
		{/each}
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
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<style lang="postcss">
	.text-vertical {
		writing-mode: vertical-lr;
	}
</style>
