<script lang="ts">
	import { page } from "$app/stores";
	import FasArrowDownLong from "~icons/fa6-solid/arrow-down-long";
	import FasArrowUpLong from "~icons/fa6-solid/arrow-up-long";
	let arr = ["Hello", "There", "General", "Kenobi"];
	let category = $page.params.category;
	function swapArr(i: number, j: number) {
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
</script>

<div class="text-center text-2xl py-4">Kategória: {category}</div>
<div class="max-w-2xl mx-auto px-8">
	{#each arr as el, i}
		<div class="flex">
			<div class="pr-4">{i + 1}.</div>
			<div class="grow">{el}</div>
			<div class="flex items-center">
                <!-- TODO: prevent going out of bounds -->
				<button on:click={() => swapArr(i, i + 1)}><FasArrowDownLong /></button>
				<button on:click={() => swapArr(i - 1, i)}><FasArrowUpLong /></button>
			</div>
		</div>
	{/each}
</div>
