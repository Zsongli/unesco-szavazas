<script lang="ts">
	import { TableHead, TableHeadCell, TableBodyCell } from "flowbite-svelte";
	import { navigating } from "$app/stores";
	import { flip } from "svelte/animate";
	import FasGripLines from "~icons/fa6-solid/grip-lines";

	type T = $$Generic<{ id: string | number | symbol }>;

	export let items: T[] = [];
	export let display: (item: T) => object = (item) => item;
	const animationDuration = 200;

	var rows: HTMLDivElement[] = [];
	var container: HTMLTableSectionElement | null = null;

	$: containerRect = container?.getBoundingClientRect();
	$: rowRects = rows.map((row) => row.getBoundingClientRect());

	var controlsDisabled = false;
	var draggedIndex = -1;
	var dragStartPos = 0;
	var offset = 0;
	var dropBeforeIndex = -1;

	function dragstart(i: number, e: PointerEvent) {
		if (draggedIndex !== -1 || controlsDisabled) return;
		document.body.style.overflow = "hidden";
		offset = 0;
		draggedIndex = i;
		dragStartPos = e.clientY;
	}

	function dragmouse(e: MouseEvent) {
		drag(e.clientY);
	}

	function dragtouch(e: TouchEvent) {
		drag(e.touches[0].clientY);
	}

	function drag(pointerY: number) {
		if (draggedIndex == -1) return;

		var futureOffset = pointerY - dragStartPos;

		// prevent dragging out of bounds
		if (rowRects[draggedIndex].top + futureOffset < containerRect!.top)
			futureOffset = containerRect!.top - rowRects[draggedIndex].top;
		else if (rowRects[draggedIndex].bottom + futureOffset > containerRect!.bottom)
			futureOffset = containerRect!.bottom - rowRects[draggedIndex].bottom;

		dropBeforeIndex = rowRects.findIndex(
			(rect) =>
				rowRects[draggedIndex].top + futureOffset < rect.top + 15 &&
				rowRects[draggedIndex].top + futureOffset > rect.top - 15 &&
				rect != rowRects[draggedIndex + 1] && // can't drop before itself
				rect != rowRects[draggedIndex]
		);

		offset = futureOffset;
	}	

	function dragend() {
		if (dropBeforeIndex !== -1) {
			items.splice(
				dropBeforeIndex < draggedIndex ? dropBeforeIndex : dropBeforeIndex - 1,
				0,
				items.splice(draggedIndex, 1)[0]
			);
			items = items;
			controlsDisabled = true;
			setTimeout(() => {
				rowRects = rows.map((row) => row.getBoundingClientRect());
				controlsDisabled = false;
			}, animationDuration + 1);
			dropBeforeIndex = -1;
		}
		draggedIndex = -1;
		document.body.style.overflow = "auto";
	}
</script>

<svelte:window
	on:pointermove={dragmouse}
	on:touchmove={dragtouch}
	on:pointerup={dragend}
	on:touchend={dragend}
/>

<div class="relative overflow-x-auto overflow-y-hidden {$$restProps.class}">
	<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400 h-full">
		<TableHead class="text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
			{#each Object.keys(display(items[0])) as key}
				<TableHeadCell>{key}</TableHeadCell>
			{/each}
			<th class="flex items-center justify-end h-full px-4 py-4">
				<slot name="grip-col-header" />
			</th>
		</TableHead>
		<tbody bind:this={container}>
			{#each items as item, i (item.id)}
				<tr
					animate:flip={{
						duration: $navigating == null && draggedIndex === -1 ? animationDuration : 0
					}}
					class="transition-opacity border-b last:border-b-0 bg-white dark:bg-gray-800 {dropBeforeIndex !==
					i
						? 'dark:border-gray-700'
						: 'border-transparent'}"
					style="{draggedIndex === i
						? `translate: 0 ${offset}px; --tw-bg-opacity: 0.75; outline: 1px solid rgb(55 65 81 / .75);`
						: ''}
						{dropBeforeIndex !== -1 && dropBeforeIndex === i ? 'box-shadow: 0 -4px 0 0 rgb(28 100 242);' : ''}"
					bind:this={rows[i]}
				>
					{#each Object.values(display(item)) as value}
						<TableBodyCell>{value}</TableBodyCell>
					{/each}
					<TableBodyCell class="flex items-center justify-end">
						<button class="cursor-grab flex items-center" on:pointerdown={(e) => dragstart(i, e)}>
							<FasGripLines class="text-gray-500" />
						</button>
					</TableBodyCell>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
