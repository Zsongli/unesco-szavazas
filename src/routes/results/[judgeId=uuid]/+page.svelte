<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	$: tableData = data.tableData;
	$: categories = data.categories;
	$: classes = data.classes;
	$: judgeName = data.judgeName;
</script>

<div class="max-w-3xl mx-auto px-8">
	<div class="text-center text-2xl my-2">{judgeName} összesítője</div>
	<div class="border grid grid-cols-[0.5fr,0.1fr,1fr,1fr,1fr,1fr,1fr,1fr] text-center">
		<div class="col-span-3" />
		{#each categories as category}
			<div>{category}</div>
		{/each}
		{#each classes as klass, i}
			<div class="text-right">{klass.name}</div>
			<div />
			<div class="text-left">({klass.country})</div>
			{#each tableData[i] as place}
				<div>{place === undefined ? "?" : place.toString()}</div>
			{/each}
		{/each}
	</div>
</div>
