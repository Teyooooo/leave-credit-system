<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { departments } from '$lib/store/webDesignStore';
	import type { EmployeeDataAdmin } from '$lib/types/data';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { toast } from 'svelte-sonner';

	let { data }: { data: EmployeeDataAdmin } = $props();

	let actionDropdownState = $state(false);
	let editDialogStates = $state(false);
	let deleteDialogStates = $state(false);
	let updateRoleDialogStates = $state(false);

	let editSubmitStates = $state(false);
	let deleteSubmitStates = $state(false);
	let updateRoleSubmitStates = $state(false);

	let editErrorStates = $state<string | undefined>();
	let deleteErrorStates = $state<string | undefined>();
	let updateRoleErrorStates = $state<string | undefined>();


	// Form Update System Role
	let systemRole = $derived(data.role_in_system)
	let hasChangeRole = $derived(systemRole !== data.role_in_system)


	// Form field states
	let formName = $derived(data.name);
	let formEmail = $derived(data.email);
	let formIdNum = $derived(data.employee_id);
	let formPosition = $derived(data.position);
	let selected_department = $derived($departments.find((f) => f.name === data.department)?.uuid || '');

	// svelte-ignore state_referenced_locally
		console.log({selected_department})

	// Check if any form field has changed
	let hasChanges = $derived(
		formName !== data.name ||
		formEmail !== data.email ||
		formIdNum !== data.employee_id ||
		formPosition !== data.position ||
		selected_department !== (data.department || '')
	);

	// Reset form when dialog closes
	$effect(() => {
		if (!editDialogStates) {
			formName = data.name;
			formEmail = data.email;
			formIdNum = data.employee_id;
			formPosition = data.position;
			selected_department = data.department || '';
		}
	});

	const triggerContent = $derived(
		$departments.find((f) => f.uuid === selected_department)?.name ?? 'Select a department'
	);
</script>

<DropdownMenu.Root
	open={actionDropdownState}
	onOpenChange={(b) => {
		actionDropdownState = b;
	}}
>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
					actionDropdownState = false;
					editDialogStates = true;
				}}
			>
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
					actionDropdownState = false;
					updateRoleDialogStates = true;
				}}
			>
				Update System Role
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={() => goto(`employees/${data?.employee_id}`)}>View Employee</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
					actionDropdownState = false;
					deleteDialogStates = true;
				}}
			>
				Delete
			</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<!-- Edit Dialog-Form -->
<Dialog.Root
	open={editDialogStates}
	onOpenChange={(open) => {
		editDialogStates = open;

        if(!open){
            editErrorStates = undefined
        }
	}}
>
	<form
		action="?/edit_employee"
		method="post"
		id="edit_employee_{data.uuid}"
		use:enhance={({ formData }) => {
			editSubmitStates = true;
			formData.append('department', selected_department);
			formData.append('uuid', data.uuid);

			return async ({ result, update }) => {
				editSubmitStates = false;
				console.log({ result });

				if (result.type === 'failure') {
					const data = result.data as { message?: string };
					editErrorStates = data?.message || 'An error occurred';
				}

				if (result.type === 'success') {
					editDialogStates = false;
					editErrorStates = undefined;
					toast.success(`Employee "${formName}" updated successfully`)
				}

				await update();
			};
		}}
	>
		<Dialog.Content class="w-md">
			<Dialog.Header>
				<Dialog.Title>Edit Employee ({data.name})</Dialog.Title>
			</Dialog.Header>
			<div class="grid gap-3">
				<Label for="name">Name</Label>
				<Input id="name" name="name" form="edit_employee_{data.uuid}" bind:value={formName} required />
			</div>
			<div class="grid gap-3">
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					form="edit_employee_{data.uuid}"
					type="email"
					bind:value={formEmail}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="id_num">ID Number</Label>
				<Input
					id="id_num"
					name="id"
					form="edit_employee_{data.uuid}"
					type="number"
					bind:value={formIdNum}
					required
				/>
			</div>
			<div class="grid gap-3">
				<Label for="department">Department</Label>
				<Select.Root type="single" name="department" bind:value={selected_department}>
					<Select.Trigger class="w-full">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Departments</Select.Label>
							{#each $departments as department}
								<Select.Item value={department.uuid}>
									{department.name}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-3">
				<Label for="position">Position</Label>
				<Input
					id="position"
					name="position"
					form="edit_employee_{data.uuid}"
					bind:value={formPosition}
					required
				/>
			</div>

			{#if editErrorStates}
				<p class="text-sm text-red-600">{editErrorStates}</p>
			{/if}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button type="submit" form="edit_employee_{data.uuid}" disabled={!hasChanges || editSubmitStates}>
					{#if editSubmitStates}
						<Spinner />
					{/if}
					Update
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>

<!-- Delete Dialog-Form -->
<Dialog.Root
	open={deleteDialogStates}
	onOpenChange={(open) => {
		deleteDialogStates = open;

        if(!open){
            deleteErrorStates = undefined;
        }
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Deleting Employee ({data.name})</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete this account and remove this data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
		{#if deleteErrorStates}
			<p class="text-sm text-red-600">{deleteErrorStates}</p>
		{/if}
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<form
				action="?/delete_employee"
				method="post"
				id="delete_employee"
				use:enhance={({ formData }) => {
					deleteSubmitStates = true;
					formData.append('uuid', data.uuid);
					formData.append('employee_name', data.name);
					formData.append('employee_id', String(data.employee_id));

					return async ({ result, update }) => {
						deleteSubmitStates = false;
						console.log({ result });

						if (result.type === 'failure') {
							const data = result.data as { message?: string };
							deleteErrorStates = data?.message || 'An error occurred';
						}

						if (result.type === 'success') {
							deleteDialogStates = false;
							deleteErrorStates = undefined;
							toast.success(`Employee "${formName}" deleted successfully`)
						}

						await update();
					};
				}}
			>
				<Button
					type="submit"
					variant="destructive"
					form="delete_employee"
					disabled={deleteSubmitStates}
				>
					{#if deleteSubmitStates}
						<Spinner />
					{/if}Delete
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Update Role Dialog Form -->
<Dialog.Root
	open={updateRoleDialogStates}
	onOpenChange={(open) => {
		updateRoleDialogStates = open;

        if(!open){
            updateRoleErrorStates = undefined;
        }
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Updating System Role ({data.name})</Dialog.Title>
		</Dialog.Header>
		<form
			action="?/update_role_employee"
			method="post"
			id="update_role_employee"
			use:enhance={({ formData }) => {
				updateRoleSubmitStates = true;
				formData.append('uuid', data.uuid);
				formData.append('role_in_system', systemRole)
				formData.append('employee_name', data.name);
				formData.append('employee_id', String(data.employee_id));

				return async ({ result, update }) => {
					updateRoleSubmitStates = false;
					console.log({ result });

					if (result.type === 'failure') {
						const data = result.data as { message?: string };
						updateRoleErrorStates = data?.message || 'An error occurred';
					}

					if (result.type === 'success') {
						updateRoleDialogStates = false;
						updateRoleErrorStates = undefined;
						toast.success(`Employee "${data.name}" role updated to "${systemRole}" successfully`)
					}

					await update();
				};
			}}
		>

		<div class="grid gap-3 my-5">
				<Label for="systemRole">Role in the System</Label>

		<Select.Root type="single" name="systemRole" bind:value={systemRole}>
		  <Select.Trigger class="w-full">
			{systemRole}
		  </Select.Trigger>
		  <Select.Content>
			<Select.Group>
			  <Select.Label>Role</Select.Label>
				<Select.Item
				  value='Client'
				  label='Client'
				>
				Client
				</Select.Item>
				<Select.Item
				  value='Admin'
				  label='Admin'
				>
				Admin
				</Select.Item>
			</Select.Group>
		  </Select.Content>
		</Select.Root>
			</div>


		{#if updateRoleErrorStates}
			<p class="text-sm text-red-600">{updateRoleErrorStates}</p>
		{/if}
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button
					type="submit"
					form="update_role_employee"
					disabled={!hasChangeRole || updateRoleSubmitStates}
				>
					{#if updateRoleSubmitStates}
						<Spinner />
					{/if}Update
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>