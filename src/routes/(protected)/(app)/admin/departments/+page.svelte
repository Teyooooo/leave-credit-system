<script lang="ts">
	import { enhance } from '$app/forms';
	import EmployeeNameCell from '$lib/components/data-table/employee-name-cell.svelte';
	import DepartmentContainer from '$lib/components/department/department-container.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { Department } from '$lib/types/data';
	import { filterArray } from '$lib/utils/helper';
	import { Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Departments', route: '/admin/departments' }
	];

	let { data }: PageProps = $props();
	let { listOfDepartments, listOfEmployees } = $derived(data);

	let dialogState = $state(false);
	let submitState = $state(false);
	let errorState = $state<string | undefined>();

	let searched_item = $state('');
	let filtered_item = $derived(filterArray<Department>(searched_item, listOfDepartments, 'name'))

	let selectValue = $state('');
	const selectTriggerContent = $derived(
		listOfEmployees.find((f) => f.uuid === selectValue)?.name ?? 'Select a employee'
	);
</script>

<div class="me-2 mt-5 mb-10 flex flex-col items-center justify-between gap-4 xl:flex-row">
	<HeaderPage
		title={'Departments'}
		message={'Manage and view the different departments within the organization.'}
	/>

	<div class="flex justify-end gap-3">
		<Input type="text" placeholder="Search department..." bind:value={searched_item} class="w-50"
		></Input>
		<Dialog.Root
			open={dialogState}
			onOpenChange={(open) => {
				dialogState = open;
				if (!open) {
					errorState = undefined;
					searched_item = '';
					selectValue = '';
				}
			}}
		>
			<Dialog.Trigger class={[buttonVariants()]}><Plus /> Add New Department</Dialog.Trigger>
			<form
				id="add_department"
				action="?/add_department"
				method="POST"
				use:enhance={({ formData }) => {
					submitState = true;
					dialogState = true;

					formData.append('dept_head', selectValue ?? undefined);

					return async ({ result, update }) => {
						submitState = false;
						console.log({ result });

						if (result.type === 'failure') {
							const data = result?.data as { message?: string };
							errorState = data.message;
						}

						if (result.type === 'success') {
							dialogState = false;
							toast.success('Department created successfully');
						}

						await update();
					};
				}}
			>
				<Dialog.Content class="sm:max-w-106.25">
					<Dialog.Header>
						<Dialog.Title>Add New Department</Dialog.Title>
					</Dialog.Header>
					<div class="grid gap-3">
						<Label for="name">Name</Label>
						<Input id="name" name="name" form="add_department" required />
					</div>
					<div class="grid gap-3">
						<Label for="dept_head">Department Head</Label>
						<Select.Root type="single" name="dept_head" bind:value={selectValue}>
							<Select.Trigger class="w-full">
								{selectTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Employees</Select.Label>
									{#each listOfEmployees as employee}
										<Select.Item value={employee.uuid}>
											<EmployeeNameCell
												name={employee.name}
												id={employee.employee_id}
												profile_pic={employee.profile_pic}
												isALink={false}
											/>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					{#if errorState}
						<p class="text-sm text-red-600">{errorState}</p>
					{/if}
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
						<Button type="submit" form="add_department" disabled={submitState}>
							{#if submitState}
								<Spinner />
							{/if}
							Add Department</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</form>
		</Dialog.Root>
	</div>
</div>

<DepartmentContainer listOfDepartments={filtered_item} {listOfEmployees}/>