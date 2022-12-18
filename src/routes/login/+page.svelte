<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, ButtonGroup, Heading, Input, InputAddon, Label, P, Helper } from "flowbite-svelte";
	import FasEnvelope from "~icons/fa6-solid/envelope";
	import FasKey from "~icons/fa6-solid/key";
    import FasEye from "~icons/fa6-solid/eye";
    import FasEyeSlash from "~icons/fa6-solid/eye-slash";
	import type { ActionData } from "./$types";

    export var form: ActionData;

    var showPassword = false;
</script>

<div class="w-full max-w-sm m-auto flex flex-col items-center gap-4 bg-gray-800 p-6 rounded-2xl mt-8">
	<Heading tag="h1" customSize="base" class="text-center text-3xl font-bold py-2">Bejelentkezés</Heading>
	<form method="post" use:enhance class="w-full flex flex-col gap-4">
		<div class="flex flex-col">
			<Label for="email" color={form?.errors?.email ? "red" : "gray"} class="mb-2">E-mail cím</Label>
			<ButtonGroup>
				<InputAddon><FasEnvelope /></InputAddon>
				<Input id="email" name="email" type="text" value={form?.data.email ?? ""} placeholder="gipsz.jakab.99x@szlgbp.hu" />
			</ButtonGroup>
            {#if form?.errors?.email}
                <Helper class="mt-2" color="red">{form.errors.email[0]}</Helper>
            {/if}
		</div>
		<div class="flex flex-col">
			<Label for="password" color={form?.errors?.password ? "red" : "gray"} class="mb-2">Jelszó</Label>
			<ButtonGroup>
				<InputAddon><FasKey /></InputAddon>
				<Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={showPassword ? "jelszavad" :"•••••••••"} />
                <InputAddon class="bg-transparent">
                    <button class="cursor-pointer" type="button" on:click={()=>showPassword = !showPassword}>
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
    <P size="xs" class="place-self-start opacity-50">Új fiókot a DÖK regisztrálhat.</P>
</div>
