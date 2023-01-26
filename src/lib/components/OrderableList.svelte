<script lang="ts">
	import { TableHead, TableHeadCell, TableBodyCell } from "flowbite-svelte";
	import { navigating } from "$app/stores";
	import { flip } from "svelte/animate";
	import FasGripLines from "~icons/fa6-solid/grip-lines";

	type T = $$Generic<{ id: string | number | symbol }>;

	export let items: T[] = [];
	export let display: (item: T) => object = (item) => item;

	var rows: HTMLDivElement[] = [];
	var rowRects: DOMRect[] = [];
	var container: HTMLTableSectionElement | null = null;
	var containerRect: DOMRect | null = null;
	$: updateRects(rows, container);
	function updateRects(...args: any[]) {
		rowRects = rows.map((row) => row.getBoundingClientRect());
		containerRect = container?.getBoundingClientRect() ?? null;
	}

	var draggedIndex = -1;
	var dropBeforeIndex = -1;

	var dragStartPos = 0;
	var offset = 0;

	function dragstart(i: number, e: PointerEvent) {
		if (draggedIndex !== -1) return;
		updateRects();

		offset = 0;
		draggedIndex = i;
		dragStartPos = e.clientY;
	}

	function drag(pointerY: number) {
		if (draggedIndex === -1) return;

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
			); // move item to new position
			items = items; // trigger update
			dropBeforeIndex = -1;
		}

		draggedIndex = -1;
	}

	const pointermove = (e: PointerEvent) => drag(e.clientY);
	function touchmove(e: TouchEvent) {
		if (draggedIndex !== -1) e.preventDefault();
		drag(e.touches[0].clientY);
	}
</script>

<svelte:window
	on:pointermove={pointermove}
	on:touchmove|nonpassive={touchmove}
	on:pointerup={dragend}
	on:touchend={dragend}
/>

<div class="relative overflow-x-auto overflow-y-hidden {$$restProps.class}">
	<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400 h-full">
		<TableHead class="text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
			{#if $$slots["index-col"]}
				<th class="px-6 py-3 w-0 border-r border-gray-800 hidden sm:table-cell">
					<slot name="index-col-header" />
				</th>
			{/if}
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
						duration: $navigating == null && draggedIndex === -1 ? 200 : 0
					}}
					class="transition-opacity border-b last:border-b-0 bg-white dark:border-gray-700 dark:bg-gray-800 dark:outline-gray-700 outline {draggedIndex ===
					i
						? '!bg-opacity-50 outline-1'
						: 'border-opacity-100 bg-opacity-100 outline-0'}"
					style={draggedIndex === i ? `translate: 0 ${offset}px;` : ""}
					bind:this={rows[i]}
				>
					{#if $$slots["index-col"]}
						<TableBodyCell class="border-r border-gray-700 hidden sm:table-cell">
							<slot name="index-col" index={i} />
						</TableBodyCell>
					{/if}

					{#each Object.values(display(item)) as value}
						<TableBodyCell
							style={dropBeforeIndex !== -1 && dropBeforeIndex === i
								? "box-shadow: 0 -4px 0 0 rgb(28 100 242);"
								: ""}>{value}</TableBodyCell
						>
					{/each}

					<TableBodyCell
						class="flex items-center justify-end"
						style={dropBeforeIndex !== -1 && dropBeforeIndex === i
							? "box-shadow: 0 -4px 0 0 rgb(28 100 242);"
							: ""}
					>
						<button class="cursor-grab flex items-center" on:pointerdown={(e) => dragstart(i, e)}>
							<FasGripLines class="text-gray-500" />
						</button>
					</TableBodyCell>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
