<script lang="ts">
	import "../app.pcss";
	import { Navbar, NavBrand, Button } from "flowbite-svelte";
	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import CustomUnescoGlobe from "~icons/custom/unesco-globe";
</script>

<Navbar class="border-b">
	<NavBrand
		href="/"
		class="gap-2 py-2 px-4 rounded-xl dark:bg-white dark:bg-opacity-0 dark:hover:bg-opacity-10 bg-black bg-opacity-0 hover:bg-opacity-10"
	>
		<CustomUnescoGlobe class="text-2xl" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Unesco Szavazás
		</span>
	</NavBrand>
	<div class="flex">
		<Button href="/login"><FasRightToBracket class="mr-2 -ml-1" />Bejelentkezés</Button>
	</div>
</Navbar>

<main class="grow">
	<slot />
</main>
