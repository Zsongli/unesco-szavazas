<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import {
		Button,
		ButtonGroup,
		Heading,
		Input,
		InputAddon,
		Label,
		Helper,
		Select
	} from "flowbite-svelte";
	import FasEnvelope from "~icons/fa6-solid/envelope";
	import FasKey from "~icons/fa6-solid/key";
	import FasEye from "~icons/fa6-solid/eye";
	import FasUser from "~icons/fa6-solid/user";
	import FasEyeSlash from "~icons/fa6-solid/eye-slash";
	import type { ActionData, PageData } from "./$types";
	import toast from "svelte-french-toast";

	export var data: PageData;
	export var form: ActionData;

	var showPassword = false;
	var selectValue: string;

	const submit: SubmitFunction =
		() =>
		async ({ result, update }) => {
			await update();
			if (result.type != "redirect" && result.type != "error" && result.data?.message) {
				if (result.type === "failure") toast.error(result.data.message);
				else if (result.type === "success") toast.success(result.data.message);
			}
		};
</script>

<svelte:head>
	<title>Regisztráció • UNESCO Szavazás</title>
</svelte:head>

<div class="w-full max-w-md m-auto px-4 mt-8">
	<div class="w-full flex flex-col items-center gap-4 bg-gray-800 p-6 rounded-2xl">
		<Heading tag="h1" customSize="base" class="text-center text-3xl font-bold py-2">
			Regisztráció
		</Heading>
		<form method="post" use:enhance={submit} class="w-full flex flex-col gap-4">
			<div class="flex flex-col">
				<Label for="email" color={form?.errors?.email ? "red" : "gray"} class="mb-2">
					E-mail cím
				</Label>
				<ButtonGroup>
					<InputAddon><FasEnvelope /></InputAddon>
					<Input
						id="email"
						name="email"
						type="text"
						value={form?.data?.email ?? ""}
						placeholder="gipsz.jakab.19x@szlgbp.hu"
					/>
				</ButtonGroup>
				{#if form?.errors?.email}
					<Helper class="mt-2" color="red">{form.errors.email[0]}</Helper>
				{/if}
			</div>
			<div class="flex flex-col">
				<Label for="fullname" color={form?.errors?.fullname ? "red" : "gray"} class="mb-2">
					Teljes név
				</Label>
				<ButtonGroup>
					<InputAddon><FasUser /></InputAddon>
					<Input
						id="fullname"
						name="fullname"
						type="text"
						value={form?.data?.fullname ?? ""}
						placeholder="Gipsz Jakab"
					/>
				</ButtonGroup>
				{#if form?.errors?.fullname}
					<Helper class="mt-2" color="red">{form.errors.fullname[0]}</Helper>
				{/if}
			</div>
			<div class="flex flex-col">
				<Label for="role" class="mb-2" color={form?.errors?.role ? "red" : "gray"}>Szerepkör</Label>
				<Select
					id="role"
					name="role"
					placeholder="Válassz egyet..."
					items={data.roles}
					bind:value={selectValue}
				/>
				{#if form?.errors?.role}
					<Helper class="mt-2" color="red">{form.errors.role[0]}</Helper>
				{/if}
			</div>
			<div class="flex flex-col">
				<Label for="password" color={form?.errors?.password ? "red" : "gray"} class="mb-2">
					Jelszó
				</Label>
				<ButtonGroup>
					<InputAddon><FasKey /></InputAddon>
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						placeholder={showPassword ? "szupertitkos" : "••••••••••••"}
					/>
					<InputAddon class="bg-transparent">
						<button
							class="cursor-pointer"
							type="button"
							on:click={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<FasEyeSlash />
							{:else}
								<FasEye />
							{/if}
						</button>
					</InputAddon>
				</ButtonGroup>
				{#if form?.errors?.password}
					<Helper class="mt-2" color="red">{form.errors.password[0]}</Helper>
				{/if}
			</div>
			<Button type="submit" class="mt-2">Küldés</Button>
		</form>
	</div>
</div>
