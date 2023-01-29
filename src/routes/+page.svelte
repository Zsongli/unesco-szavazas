<script lang="ts">
	import { Button, Heading, Span } from "flowbite-svelte";
	import type { PageData } from "./$types";
	import FasTableList from "~icons/fa6-solid/table-list";
	import FasSquarePollVertical from "~icons/fa6-solid/square-poll-vertical";
	import FasRightToBracket from "~icons/fa6-solid/right-to-bracket";

	export var data: PageData;

	const photos = [
		"https://szlgbp.hu/wp-content/uploads/2022/09/spanyol5_52333689069_o.jpg",
		"https://szlgbp.hu/wp-content/uploads/2022/09/ciprus2_52332435237_o.jpg",
		"https://szlgbp.hu/wp-content/uploads/2022/09/egyiptom4_52333626783_o.jpg",
		"https://szlgbp.hu/wp-content/uploads/2022/09/konferansz1_52332435717_o.jpg",
		"https://szlgbp.hu/wp-content/uploads/2022/09/kina2_52333819095_o.jpg",
		"https://szlgbp.hu/wp-content/uploads/2022/09/egyiptom0_52333688359_o.jpg"
	];
</script>

<svelte:head>
	<title>Üdvözlet • UNESCO Szavazás</title>
	<meta name="description" content="UNESCO Szavazás" />
</svelte:head>

<div class="m-auto max-w-7xl flex flex-col items-center gap-2 mt-8 landscape:mt-16 px-8">
	<div class="grid grid-rows-2 xl:grid-cols-[3fr,2fr] min-h-fit gap-14">
		<div class="flex flex-col gap-6 xl:items-stretch items-center text-center xl:text-left">
			<Heading tag="h2" class="!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
				Üdvözöllek az UNESCO műsorok
				<Span class="!text-blue-600 font-bold">szavazóalkalmazásában!</Span>
			</Heading>
			<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400">
				Itt szavazhatnak a zsűritagok a kedvenc UNESCO műsoraikra, az alkalmazás pedig összesíti a
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
					A kezdéshez kérlek válassz az alábbi lehetőségek közül:
				</p>
				<div
					class="flex flex-col justify-center gap-4 bg-gray-700 p-4 rounded-md self-stretch md:self-center sm:flex-row xl:self-stretch md:w-fit md:justify-start"
				>
					{#if data.user.role.permissions.includes("vote")}
						<Button href="/ordering" class="gap-2 md:px-6 md:py-3.5 md:text-base">
							<FasTableList /> Szavazás
						</Button>
					{/if}
					{#if data.user.role.permissions.includes("view-results")}
						<Button href="/results" class="gap-2 md:px-6 md:py-3.5 md:text-base">
							<FasSquarePollVertical /> Eredmények
						</Button>
					{/if}
				</div>
			{/if}
		</div>
		<a
			href="https://szlgbp.hu/2022/09/12/unesco-musor-2022/"
			rel="noreferrer"
			target="_blank"
			class="hidden xl:block justify-self-end w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl"
		>
			<img
				class="w-full h-full object-cover object-center"
				src={photos[Math.floor(Math.random() * photos.length)]}
				alt="placeholder"
			/>
		</a>
	</div>
</div>
