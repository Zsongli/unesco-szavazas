<script lang="ts">
	import "../app.pcss";
	import {
		Navbar,
		NavBrand,
		Button,
		FooterIcon,
		Avatar,
		Dropdown,
		DropdownItem
	} from "flowbite-svelte";
	import FasKey from "~icons/fa6-solid/key";
	import FasRightFromBracket from "~icons/fa6-solid/right-from-bracket";
	import FabGithub from "~icons/fa6-brands/github";
	import CustomUnescoGlobe from "~icons/custom/unesco-globe";
	import CustomSzlgLogo from "~icons/custom/szlg-logo";
	import { Toaster } from "svelte-french-toast";
	import type { LayoutData } from "./$types";
	import { enhance } from "$app/forms";
	import { navigating } from "$app/stores";
	import PageLoader from "$lib/components/PageLoader.svelte";

	export var data: LayoutData;
</script>

<Toaster />

<Navbar class="border-b" navDivClass="mx-auto flex justify-between items-center">
	<NavBrand
		href="/"
		class="gap-2 py-2 px-4 rounded-xl dark:bg-white dark:bg-opacity-0 dark:hover:bg-opacity-10 bg-black bg-opacity-0 hover:bg-opacity-10"
	>
		<CustomUnescoGlobe class="text-2xl" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			UNESCO Szavazás
		</span>
	</NavBrand>
	<div class="flex">
		{#if data.user}
			<Button pill color="light" id="avatar" class="!p-1 sm:!pr-4 min-w-[50px]">
				<Avatar
					src="https://api.dicebear.com/5.x/initials/svg?seed={data.user.name}&scale=65"
					class="sm:mr-2 min-w-min"
				/>
				<span class="hidden sm:inline">
					{data.user.name}
				</span>
			</Button>
			<Dropdown triggeredBy="#avatar" class="w-full py-1">
				<div slot="header" class="px-4 py-2">
					<span class="block text-sm text-gray-900 dark:text-white">
						{data.user.name} - {data.user.role.name}
					</span>
					<span class="block truncate text-xs opacity-75">{data.user.email}</span>
				</div>
				<DropdownItem href="/change-password" class="flex items-center gap-2">
					<FasKey />Jelszóváltoztatás
				</DropdownItem>
				<form slot="footer" action="/logout" method="post" use:enhance>
					<DropdownItem type="submit" class="flex items-center gap-2 hover:!bg-red-600">
						<FasRightFromBracket />Kijelentkezés
					</DropdownItem>
				</form>
			</Dropdown>
		{/if}
	</div>
</Navbar>

{#if $navigating}
	<PageLoader message="Egy pillanat..." />
{/if}

<main class="grow">
	<slot />
</main>

<footer
	class="bg-white dark:bg-gray-800 rounded-t-lg p-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
>
	<div class="flex gap-4">
		<a href="/" class="flex items-center dark:text-white">
			<CustomUnescoGlobe class="text-2xl" />
		</a>
		<div class="flex flex-col gap-1">
			<span class="font-semibold text-sm uppercase dark:text-white"
				>2024 - Szent László Gimnázium</span
			>
			<span class="text-xs">Fejlesztették: Makai Tamás, Mélykuti Ádám és Varga Benedek</span>
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
