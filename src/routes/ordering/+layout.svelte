<script lang="ts">
	import type { LayoutServerData } from "./$types";
	import { page } from "$app/stores";
	import { Heading } from "flowbite-svelte";

	export var data: LayoutServerData;
</script>

<div class="max-w-2xl mx-auto px-4 py-2 flex flex-col items-center gap-4 mt-4">
	<Heading tag="h2" class="text-center">Sorbarendezés</Heading>
	<ul class="w-fit max-w-full m-auto flex items-center list-none overflow-x-auto">
		{#each data.categories as category}
			<li class="group" role="presentation">
				<a
					class="{$page.params.category === category.id.toString()
						? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500 active cursor-default'
						: 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400'} inline-block text-sm font-medium text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent"
					href="/ordering/{category.id}">{category.name}</a
				>
			</li>
		{/each}
	</ul>
	<div class="p-4 w-full bg-gray-800 rounded-lg relative">
		<slot />
	</div>
</div>
