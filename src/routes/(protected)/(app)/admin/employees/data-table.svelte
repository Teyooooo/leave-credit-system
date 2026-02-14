<script lang="ts" generics="TData, TValue">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table/index.js';
	import { departments } from '$lib/store/webDesignStore';
	import { Plus } from '@lucide/svelte';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type SortingState
	} from '@tanstack/table-core';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let { data, columns }: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([{ id: 'name', desc: false }]);
	let globalFilter = $state('');
	let columnFilters = $state<ColumnFiltersState>([]);
	let departmentFilter = $state<string>('all');

	const table = createSvelteTable({
		get data() {
			return data;
		},
		// svelte-ignore state_referenced_locally
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get globalFilter() {
				return globalFilter;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === 'function') {
				globalFilter = updater(globalFilter);
			} else {
				globalFilter = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	$effect(() => {
		// Only track departmentFilter, not columnFilters
		const dept = departmentFilter;

		untrack(() => {
			if (dept === 'all') {
				table.getColumn('department')?.setFilterValue('');
			} else {
				table.getColumn('department')?.setFilterValue(dept);
			}
		});
	});

	const triggerDepartmentFilter = $derived(
		departmentFilter === 'all' ? 'Filter by department' : departmentFilter
	);

	// for adding new employee
	let isOpen = $state(false);
	let inSubmit = $state(false);
	let selectedDepartment = $state('');
	const triggerContent = $derived(
		departments.find((f) => f === selectedDepartment) ?? 'Select a department'
	);
	let isHaveErrorForm = $state<string | undefined>();
</script>

<div class='@container/main'>
	<!-- Filters -->
	<div class=" @container/top flex py-4 @sm/main:@max-lg/main:flex-col @sm/main:gap-4 ">
		<div class="flex flex-col grow justify-start gap-4 @[780px]/top:flex-row">
			<Input
				placeholder="Search by name, email, or ID..."
				value={globalFilter ?? ''}
				oninput={(e) => (globalFilter = e.currentTarget.value)}
				class="max-w-sm"
			/>

			<Select.Root type="single" name="department" bind:value={departmentFilter}>
				<Select.Trigger class="w-min-70">
					{triggerDepartmentFilter}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Departments</Select.Label>
						<Select.Item value="all" label="All Departments">All Departments</Select.Item>
						{#each departments as department}
							<Select.Item value={department} label={department}>
								{department}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div>
			<Dialog.Root
				open={isOpen}
				onOpenChange={(open) => {
					isOpen = open;

					if (!open) {
						selectedDepartment = '';
						isHaveErrorForm = undefined;
					}
				}}
			>
				<Dialog.Trigger class={[buttonVariants({})]}>
					<Plus /> Add Employee
				</Dialog.Trigger>
				<form
					action="?/add_employee"
					method="post"
					id="add_employee"
					use:enhance={({ formData }) => {
						inSubmit = true;
						isOpen = true;
						formData.append('department', selectedDepartment);

						return async ({ result, update }) => {
							inSubmit = false;
							console.log({ result });

							if (result.type === 'failure') {
								const data = result.data as { message?: string };
								isHaveErrorForm = data?.message || 'An error occurred';
							}

							if (result.type === 'success') {
								isOpen = false;
								selectedDepartment = '';
								isHaveErrorForm = undefined;
								toast.success('Employee account created successfully')
								
							}

							await update();
						};
					}}
				>
					<Dialog.Content class="w-md">
						<Dialog.Header>
							<Dialog.Title>Add New Employee</Dialog.Title>
						</Dialog.Header>
						<div class="grid gap-3">
							<Label for="name">Name</Label>
							<Input id="name" name="name" form="add_employee" required />
						</div>
						<div class="grid gap-3">
							<Label for="email">Email</Label>
							<Input id="email" name="email" form="add_employee" type="email" required />
						</div>
						<div class="grid gap-3">
							<Label for="id_num">ID Number</Label>
							<Input id="id_num" name="id" form="add_employee" type="number" required />
						</div>
						<div class="grid gap-3">
							<Label for="department">Department</Label>
							<Select.Root type="single" name="department" bind:value={selectedDepartment}>
								<Select.Trigger class="w-full">
									{triggerContent}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Departments</Select.Label>
										{#each departments as department}
											<Select.Item value={department} label={department}>
												{department}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid gap-3">
							<Label for="position">Position</Label>
							<Input id="position" name="position" form="add_employee" required />
						</div>
						{#if isHaveErrorForm}
							<p class="text-sm text-red-600">{isHaveErrorForm}</p>
						{/if}
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" form="add_employee" disabled={inSubmit}>
								{#if inSubmit}
									<Spinner />
								{/if}
								Add Employee</Button
							>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-between py-4">
		<div class="text-sm text-muted-foreground">
			{#if table.getFilteredRowModel().rows.length > 0}
				Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min(
					(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
					table.getFilteredRowModel().rows.length
				)} of {table.getFilteredRowModel().rows.length} items
			{:else}
				No items
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	</div>
</div>
