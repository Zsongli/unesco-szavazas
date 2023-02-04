<script lang="ts">
	import { Avatar, Heading, Listgroup } from "flowbite-svelte";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";
	import type { LayoutData } from "./$types";
	import { page } from "$app/stores";
	import "$lib/styles/results.pcss";

	export var data: LayoutData;
</script>

<div class="max-w-max mx-auto px-4 py-2 flex flex-col items-center gap-8 my-4">
	<Heading tag="h2" class="text-center">Eredmények</Heading>

	<div class="flex flex-col items-center gap-12 w-full">
		<Listgroup active class="min-w-fit w-3/4 max-w-[16rem]">
			<h3 class="text-center text-white font-bold py-2 bg-gray-700 rounded-t-lg">Szavazatok</h3>
			<div class="max-h-48 overflow-y-auto thin-scrollbar">
				{#each data.judges as { id, name }}
					<svelte:element
						this={$page.params.judgeId === id ? "div" : "a"}
						href={$page.params.judgeId === id ? undefined : `/results/${id}`}
						class="judge-link {$page.params.judgeId === id ? 'selected' : ''}"
					>
						<Avatar
							src="https://api.dicebear.com/5.x/initials/svg?seed={name}&scale=85"
							size="xs"
						/>
						{name}
					</svelte:element>
				{/each}
			</div>
			<svelte:element
				this={$page.url.pathname === "/results" ? "div" : "a"}
				href={$page.url.pathname === "/results" ? undefined : "/results"}
				class="summary-link {$page.url.pathname === '/results' ? 'selected' : ''}"
			>
				<FasSquarePollVertical /> Összesítés
			</svelte:element>
		</Listgroup>

		<div class="p-4 w-full bg-gray-800 rounded-lg relative">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	.judge-link {
		@apply inline-flex relative items-center text-left py-2 px-4 w-full font-medium text-base gap-2;

		&.selected {
			@apply border-l-2 border-gray-500;
		}

		&:not(.selected) {
			@apply hover:bg-gray-600 hover:text-white hover:underline focus:z-40 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-white;
		}
	}

	.summary-link {
		@apply flex items-center justify-center p-3 gap-2 font-bold bg-gray-700 rounded-b-lg;

		&.selected {
			@apply !border-gray-500 !border-t-2;
		}

		&:not(.selected) {
			@apply hover:bg-gray-600 hover:underline hover:text-white;
		}
	}
</style>
