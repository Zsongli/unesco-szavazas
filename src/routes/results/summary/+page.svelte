<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	let summary = data.summary;
	const categories = ["Előadásmód", "Díszlet", "Információ", "Tánc", "Humor"];
</script>

<div class="max-w-3xl mx-auto px-8">
	<div class="border grid grid-cols-[0.5fr,0.1fr,1fr,1fr,1fr,1fr,1fr,1fr] text-center">
		<div class="col-span-3" />
		{#each categories as category}
			<div>{category}</div>
		{/each}
		{#each summary as row (row.name)}
			<div class="text-right">{row.name}</div>
			<div />
			<div class="text-left">({row.country})</div>
			{#each categories as category}
				<div>{row.score[category]}</div>
			{/each}
		{/each}
	</div>
</div>
