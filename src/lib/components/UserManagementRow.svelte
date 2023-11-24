<script lang="ts">
	import {
		Button,
		Input,
		Popover,
		Select,
		Spinner,
		TableBodyCell,
		TableBodyRow
	} from "flowbite-svelte";
	import FasCheck from "~icons/fa6-solid/check";
	import FasTrash from "~icons/fa6-solid/trash";
	import "$lib/styles/tables.pcss";
	import { createEventDispatcher, onMount } from "svelte";
	import toast from "svelte-french-toast";

	const dispatch = createEventDispatcher<{ del: {} }>();

	export var roles: { value: string; name: string }[];
	export var entry: {
		id: string;
		name: string;
		email: string;
		role: {
			id: number;
		};
		createdAt: Date;
		updatedAt: Date;
	};

	$: originalChecksum = [entry.name, entry.email, entry.role.id].join("");
	$: modified = originalChecksum !== [name, email, roleId].join("");

	var name: string = entry.name,
		email: string = entry.email,
		roleId: string = entry.role.id.toString();

	const dateTimeFormat = new Intl.DateTimeFormat("hu", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});

	var saving = false;
	async function save() {
		saving = true;
		const res = await fetch(`/users/${entry.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				email,
				roleId: Number(roleId)
			})
		});

		if (res.ok) {
			toast.success((await res.json()).message, {
				className: "!text-gray-500 !bg-white !shadow dark:!text-gray-400 dark:!bg-gray-800 gap-4"
			});
			entry.name = name;
			entry.email = email;
			entry.role.id = Number(roleId);
		} else toast.error((await res.json()).message ?? "Hiba történt a felhasználó mentése közben.");
		saving = false;
	}

	var deleting = false;
	async function del() {
		deleting = true;
		const res = await fetch(`/users/${entry.id}`, {
			method: "DELETE"
		});

		if (res.ok) {
			toast.success((await res.json()).message);
			dispatch("del");
		} else toast.error((await res.json()).message ?? "Hiba történt a felhasználó törlése közben.");
		deleting = false;
	}

	let uidHeight: number;

	onMount(() => {
		let uidElement = document.getElementById(`uid-${entry.id}`)!;

		const onResize = () => (uidHeight = uidElement.clientHeight);
		window.addEventListener("resize", onResize);
		onResize();

		return () => window.removeEventListener("resize", onResize);
	});
</script>

<TableBodyRow class="divide-x divide-gray-700">
	<TableBodyCell class="max-w-[5rem] !p-0" id="uid-{entry.id}">
		<div
			class="overflow-auto thin-scrollbar w-full h-full px-4 flex items-center"
			style="height: {uidHeight}px;"
		>
			{entry.id}
		</div>
	</TableBodyCell>
	<TableBodyCell class="min-w-[15rem]">
		<Input type="text" bind:value={name} />
	</TableBodyCell>
	<TableBodyCell class="min-w-[15rem]">
		<Input type="text" bind:value={email} />
	</TableBodyCell>
	<TableBodyCell class="min-w-[10rem]">
		<Select items={roles} bind:value={roleId} placeholder="Válassz..." />
	</TableBodyCell>
	<TableBodyCell>{dateTimeFormat.format(entry.createdAt)}</TableBodyCell>
	<TableBodyCell>{dateTimeFormat.format(entry.updatedAt)}</TableBodyCell>
	<TableBodyCell class="w-0">
		<div class="flex items-center justify-end gap-2">
			{#if modified}
				<Button
					color="green"
					outline
					size="sm"
					id="save-{entry.id}"
					disabled={saving}
					on:click={save}
				>
					{#if saving}
						<Spinner color="white" size="3" />
					{:else}
						<FasCheck />
					{/if}
				</Button>
				<Popover triggeredBy="#save-{entry.id}">Mentés</Popover>
			{/if}
			<Button
				color="red"
				outline
				size="sm"
				id="remove-{entry.id}"
				disabled={deleting}
				on:click={del}
			>
				{#if deleting}
					<Spinner color="white" size="3" />
				{:else}
					<FasTrash />
				{/if}
			</Button>
			<Popover triggeredBy="#remove-{entry.id}">Törlés</Popover>
		</div>
	</TableBodyCell>
</TableBodyRow>
