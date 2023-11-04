<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { Heading, Label, Button, Input, Helper, InputAddon, ButtonGroup } from "flowbite-svelte";
	import FasKey from "~icons/fa6-solid/key";
	import FasEye from "~icons/fa6-solid/eye";
	import FasEyeSlash from "~icons/fa6-solid/eye-slash";
	import toast from "svelte-french-toast";
	import type { ActionData } from "./$types";

	export var form: ActionData;
	const submit: SubmitFunction =
		() =>
		async ({ result, update }) => {
			await update();
			if (result.type != "redirect" && result.type != "error" && result.data?.message) {
				if (result.type === "failure") toast.error(result.data.message);
				else if (result.type === "success") toast.success(result.data.message);
			}
		};

	var showOldPassword = false;
	var showNewPassword = false;
</script>

<svelte:head>
	<title>Jelszóváltoztatás • Gólyabál Szavazás</title>
</svelte:head>

<div class="w-full max-w-sm m-auto px-4 mt-8">
	<div class="w-full flex flex-col items-center gap-4 bg-gray-800 p-6 rounded-2xl">
		<Heading tag="h1" customSize="base" class="text-center text-3xl font-bold py-2">
			Jelszóváltoztatás
		</Heading>
		<form method="post" use:enhance={submit} class="w-full flex flex-col gap-4">
			<div class="flex flex-col">
				<Label for="oldPassword" class="mb-2" color={form?.errors?.oldPassword ? "red" : "gray"}>
					Jelenlegi jelszó
				</Label>
				<ButtonGroup>
					<InputAddon><FasKey /></InputAddon>
					<Input
						id="oldPassword"
						name="oldPassword"
						type={showOldPassword ? "text" : "password"}
						placeholder={showOldPassword ? "szupertitkos" : "••••••••••••"}
					/>
					<InputAddon class="bg-transparent">
						<button
							class="cursor-pointer"
							type="button"
							on:click={() => (showOldPassword = !showOldPassword)}
						>
							{#if showOldPassword}
								<FasEyeSlash />
							{:else}
								<FasEye />
							{/if}
						</button>
					</InputAddon>
				</ButtonGroup>
				{#if form?.errors?.oldPassword}
					<Helper class="mt-2" color="red">{form.errors.oldPassword[0]}</Helper>
				{/if}
			</div>
			<div class="flex flex-col">
				<Label for="newPassword" class="mb-2" color={form?.errors?.newPassword ? "red" : "gray"}>
					Új jelszó
				</Label>
				<ButtonGroup>
					<InputAddon><FasKey /></InputAddon>
					<Input
						id="newPassword"
						name="newPassword"
						type={showNewPassword ? "text" : "password"}
						placeholder={showNewPassword ? "mégtitkosabb" : "••••••••••••"}
					/>
					<InputAddon class="bg-transparent">
						<button
							class="cursor-pointer"
							type="button"
							on:click={() => (showNewPassword = !showNewPassword)}
						>
							{#if showNewPassword}
								<FasEyeSlash />
							{:else}
								<FasEye />
							{/if}
						</button>
					</InputAddon>
				</ButtonGroup>
				{#if form?.errors?.newPassword}
					<Helper class="mt-2" color="red">{form.errors.newPassword[0]}</Helper>
				{/if}
			</div>
			<Button type="submit" class="mt-2">Frissítés</Button>
		</form>
	</div>
</div>
