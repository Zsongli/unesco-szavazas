<script lang="ts">
	import type { LayoutServerData } from "./$types";
	import { page } from "$app/stores";
	import { Heading } from "flowbite-svelte";
	import FasAngleRight from "~icons/fa6-solid/angle-right";
	import FasAngleLeft from "~icons/fa6-solid/angle-left";

	export var data: LayoutServerData;
	$: category = Number($page.params.category);
	$: currentCategoryIndex = data.categories.findIndex((c) => c.id === category);
</script>

<div class="min-w-min max-w-2xl mx-auto px-4 py-2 flex flex-col items-center gap-8 mt-4">
	<Heading tag="h2" class="text-center">Sorbarendezés</Heading>
	<ul class="w-fit max-w-full m-auto hidden sm:flex items-center list-none overflow-x-auto">
		{#each data.categories as { id, name } (id)}
			<li class="group" role="presentation">
				<svelte:element
					this={category === id ? "div" : "a"}
					class="{category === id
						? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500 active cursor-default'
						: 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400'} inline-block text-sm font-medium text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent"
					href={category === id ? undefined : `/ordering/${id}`}>{name}</svelte:element
				>
			</li>
		{/each}
	</ul>

	<div
		class="w-full m-auto sm:hidden grid grid-cols-3 grid-rows-1 items-center gap-2"
	>
		<div class="justify-self-end">
			{#if currentCategoryIndex - 1 >= 0}
				<a href="/ordering/{data.categories[currentCategoryIndex - 1].id}">
					<FasAngleLeft class="text-gray-400 hover:text-gray-300" />
				</a>
			{/if}
		</div>
		<div class="text-center text-sm font-medium text-white border-b-2 px-4 py-2 justify-self-center">
			{data.categories[currentCategoryIndex].name}
		</div>
		<div class="justify-self-start">
			{#if currentCategoryIndex + 1 < data.categories.length}
				<a href="/ordering/{data.categories[currentCategoryIndex + 1].id}">
					<FasAngleRight class="text-gray-400 hover:text-gray-300" />
				</a>
			{/if}
		</div>
	</div>

	<div class="p-4 w-full bg-gray-800 rounded-lg relative">
		<slot />
	</div>
</div>
