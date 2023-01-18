<script lang="ts">
	import "../app.pcss";
	import { Navbar, NavBrand, Button, FooterIcon } from "flowbite-svelte";
	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import FasRightFromBracket from "~icons/fa6-solid/right-from-bracket";
	import FabGithub from "~icons/fa6-brands/github";
	import CustomUnescoGlobe from "~icons/custom/unesco-globe";
	import CustomSzlgLogo from "~icons/custom/szlg-logo";
	import FlowbiteToaster from "$lib/components/flowbite-toast/Toaster.svelte";
	import type { LayoutData } from "./$types";
	import { enhance } from "$app/forms";

	export var data: LayoutData;
</script>

<FlowbiteToaster />

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
		{#if !data.user}
			<Button href="/login"><FasRightToBracket class="mr-2 -ml-1" />Bejelentkezés</Button>
		{:else}
			<form action="/logout" method="post" use:enhance>
				<Button type="submit" color="red"><FasRightFromBracket class="mr-2 -ml-1" />Kijelentkezés</Button>
			</form>
		{/if}
	</div>
</Navbar>

<main class="grow">
	<slot />
</main>

<footer
	class="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
>
	<div class="flex gap-4">
		<a href="/" class="flex items-center dark:text-white">
			<CustomUnescoGlobe class="text-2xl" />
		</a>
		<div class="flex flex-col gap-1">
			<span class="font-semibold text-sm uppercase dark:text-white"
				>2022 - Szent László Gimnázium</span
			>
			<span class="text-xs">Fejlesztették: Makai Tamás és Mélykuti Ádám</span>
		</div>
	</div>
	<div class="flex space-x-4 sm:justify-center items-center">
		<FooterIcon
			rel="external"
			target="_blank"
			href="http://szlgbp.hu"
			class="text-gray-400 hover:text-gray-900"
		>
			<CustomSzlgLogo />
		</FooterIcon>
		<FooterIcon
			rel="external"
			target="_blank"
			href="https://github.com/Zsongli/unesco-szavazas"
			class="text-gray-400 hover:text-gray-900"
		>
			<FabGithub />
		</FooterIcon>
	</div>
</footer>
