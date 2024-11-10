<script lang="ts">
	import { Button, Heading, Span } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import FasTableList from "~icons/fa6-solid/table-list";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";
	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";
	import FasUsersGear from "~icons/fa6-solid/users-gear";

	export var data: PageData;

	const photos = [
        "golyaB.jpg",
        "golyaE.jpg",
        "golyaE2.jpg",
        "golyaF.jpg",
        "golyaF2.jpg",
        "golyaMIB.jpg",
        "golyaShrek.jpg",
        "golyaTuz.jpg",
        "beni.jpg",
	];
</script>

<svelte:head>
	<title>Üdvözlet • Gólyabál Szavazás</title>
	<meta name="description" content="Gólyabál Szavazás" />
</svelte:head>

<div class="m-auto max-w-7xl flex flex-col items-center gap-2 mt-8 landscape:mt-16 px-8">
	<div class="grid xl:grid-cols-[3fr,2fr] min-h-fit gap-14">
		<div class="flex flex-col gap-6 xl:items-stretch items-center text-center xl:text-left">
			<Heading tag="h2" class="!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
				Üdvözöllek a Gólyabál
				<Span
					class="font-bold"
					gradient
					gradientClass="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-700"
				>
					szavazóalkalmazásában!
				</Span>
			</Heading>
			<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
				Itt szavazhatnak a zsűritagok a kedvenc Gólyabál műsoraikra, az alkalmazás pedig összesíti a
				szavazatokat a szervezők számára.
			</p>
			{#if !data.user}
				<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
					A kezdéshez kérlek jelentkezz be!
				</p>
				<Button href="/login" class="gap-2 md:px-6 md:py-3.5 md:text-base lg:max-w-xs">
					<FasRightToBracket /> Bejelentkezés
				</Button>
			{:else}
				<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
					A következő lehetőségek állnak rendelkezésedre:
				</p>

				{@const perms = data.user.role.permissions}
				<div
					class="flex flex-col justify-center gap-4 bg-gray-700 p-4 rounded-md self-stretch md:self-center sm:flex-row xl:self-stretch md:w-fit md:justify-start"
				>
					{#if perms.includes("vote")}
						<Button href="/ordering" class="gap-2 md:px-6 md:py-3.5 md:text-base">
							<FasTableList /> Szavazás
						</Button>
					{/if}
					{#if perms.includes("view-results")}
						<Button href="/results" class="gap-2 md:px-6 md:py-3.5 md:text-base">
							<FasSquarePollVertical /> Eredmények
						</Button>
					{/if}
					{#if perms.includes("manage-users")}
						<Button href="/users" class="gap-2 md:px-6 md:py-3.5 md:text-base">
							<FasUsersGear /> Felhasználók kezelése
						</Button>
					{/if}
				</div>
			{/if}
		</div>
		<a
			href="https://flic.kr/s/aHBqjB5q3x"
			rel="noreferrer"
			target="_blank"
			class="hidden xl:block justify-self-end w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl"
		>
			<img
				class="w-full h-full object-cover object-center"
				src="/homepage/{photos[Math.floor(Math.random() * photos.length)]}"
				alt="Gólyabál 2023"
			/>
		</a>
	</div>
</div>
