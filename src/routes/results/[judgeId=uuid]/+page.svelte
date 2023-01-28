<script lang="ts">
	import {
		Avatar,
		Heading,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from "flowbite-svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: tableData = data.tableData;
	$: categories = data.categories;
	$: classes = data.classes;
	$: judgeName = data.judgeName;

	console.log(data);
</script>

<svelte:head>
	<title>Eredmények • {judgeName} • UNESCO Szavazás</title>
</svelte:head>

<!-- TODO: show finalization status -->
<Table divClass="relative overflow-x-auto rounded-t-lg" class="w-full">
	<TableHead>
		<th class="px-3 py-6 flex flex-col items-center justify-center gap-2">
			<Avatar src="https://api.dicebear.com/5.x/initials/svg?seed={judgeName}&scale=85" border size="sm"></Avatar>
			<Span class="text-center normal-case">{judgeName}</Span>
		</th>
		{#each categories as category}
			<th class="py-3 text-vertical rotate-[179.9deg] border-gray-800 border-l">{category}</th>
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
					<TableBodyCell class="border-gray-700 text-center">{place ?? ".."}.</TableBodyCell>
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
