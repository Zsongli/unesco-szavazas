<script lang="ts">
	import { Avatar, Heading, Listgroup } from "flowbite-svelte";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";
</script>

<div class="max-w-xl mx-auto px-4 py-2 flex flex-col items-center gap-8 mt-4">
	<Heading tag="h2" class="text-center">Eredmények</Heading>

	<Listgroup active class="w-64">
		<h3 class="text-center text-white font-bold py-2 bg-gray-700 rounded-t-lg">Szavazatok</h3>
		<div class="max-h-48 overflow-y-scroll">
			<!-- <a
				href="/results/fb3197e8-3b2b-44e3-ace2-c4bd0f2f406f"
				class="inline-flex relative items-center text-left py-2 px-4 w-full font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white hover:underline focus:z-40 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:focus:ring-gray-500 dark:focus:text-white text-base gap-2"
			>
				<Avatar src="https://api.dicebear.com/5.x/initials/svg?seed=Végh Béla&scale=85" size="xs"/>
                Végh Béla
			</a> -->
		</div>
		<a
			href="/results"
			class="flex items-center justify-center p-3 gap-2 font-bold bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline rounded-b-lg"
		>
			<FasSquarePollVertical />Összesítés
		</a>
	</Listgroup>

	<div class="p-4 w-full bg-gray-800 rounded-lg relative">
		<slot />
	</div>
</div>
