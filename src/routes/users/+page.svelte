<script lang="ts">
	import UserManagementRow from "$lib/components/UserManagementRow.svelte";
	import {
		Button,
		Heading,
		Table,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
        Alert,
        Span
	} from "flowbite-svelte";
	import type { PageData } from "./$types";
	import FasUserPlus from "~icons/fa6-solid/user-plus";
	import FasTriangleExclamation from "~icons/fa6-solid/triangle-exclamation";
	import "$lib/styles/tables.pcss";

	export var data: PageData;
</script>

<svelte:head>
	<title>Felhasználók kezelése • UNESCO Szavazás</title>
</svelte:head>

<div class="flex flex-col gap-8 py-8 w-5/6 m-auto">
	<Heading tag="h3" class="text-center">Felhasználók kezelése</Heading>
    <Alert color="red" dismissable>
        <FasTriangleExclamation slot="icon" />
        <Span class="font-medium !text-red-900">Figyelem!</Span> Az alkalmazás jelenlegi azonosítási rendszerének <Span italic class="!text-red-800">(JWT)</Span> működési elvei miatt a felhasználók adatai valójában csak a kijelentkezésük után frissülnek.
      </Alert>
	<Table divClass="relative overflow-x-auto thin-scrollbar rounded-lg">
		<TableHead>
			<TableHeadCell>Azonosító</TableHeadCell>
			<TableHeadCell>Teljes név</TableHeadCell>
			<TableHeadCell>E-mail cím</TableHeadCell>
			<TableHeadCell>Szerepkör</TableHeadCell>
			<TableHeadCell>Létrehozva</TableHeadCell>
			<TableHeadCell>Legutóbb változtatva</TableHeadCell>
			<th class="px-6 py-3 text-right">Műveletek</th>
		</TableHead>
		<tbody class="divide-y">
			{#each data.users as user (user.id)}
				<UserManagementRow
					entry={user}
					roles={data.roles}
					on:del={() => (data.users = data.users.filter((u) => u.id !== user.id))}
				/>
			{/each}
			<TableBodyRow>
				<TableBodyCell colspan="7">
					<Button class="gap-2 w-full" outline href="/users/register"><FasUserPlus />Új</Button>
				</TableBodyCell>
			</TableBodyRow>
		</tbody>
	</Table>
</div>
