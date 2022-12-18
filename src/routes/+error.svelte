<script lang="ts">
	import { page } from "$app/stores";
	import "$lib/styles/glitch.pcss";
	import { Heading, A, P, Span } from "flowbite-svelte";
    import FasTriangleExclamation from "~icons/fa6-solid/triangle-exclamation";

	const messages: Record<number, string> = {
		400: "Hibás kérelem",
		401: "Azonosítás szükséges",
		403: "Jogosultság szükséges",
		404: "Az oldal nem található",
		406: "Nem elfogadható",
		408: "A kérés túllépte a megengedett időtartamot",
		500: "Belső szerverhiba",
		501: "Nincs megvalósítva",
		502: "Rossz átjáró"
	};

	function getMessage(status: number, fallback?: string) {
		return messages[status] ?? fallback ?? "Ismeretlen";
	}
</script>

<svelte:head>
	<title>{$page.status} - {getMessage($page.status, $page.error?.message)}</title>
</svelte:head>

<div
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center gap-20"
>
	<Heading tag="h2">Hiba történt...</Heading>
	<div class="flex flex-col items-center justify-center">
		<div class="fixed opacity-10">
			<FasTriangleExclamation font-size="10rem" />
		</div>
		<Heading tag="h2">
			<div class="glitch-wrapper">
				<div class="glitch" data-text={$page.status}>
					{$page.status}
				</div>
			</div>
		</Heading>
		<P size="lg">{getMessage($page.status, $page.error?.message)}</P>
	</div>

	<P size="sm" align="center" class="opacity-50">
		<Span italic>Őszintén</Span> sajnáljuk. Megpróbálhatsz másra keresni, vagy visszatérhetsz a
		<A href="/">főoldalra</A>.
	</P>
</div>
