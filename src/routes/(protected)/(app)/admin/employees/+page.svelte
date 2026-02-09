<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { EmployeeDataAdmin } from '$lib/types/data';
	import { UsersRound } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { columns } from './column';
	import DataTable from './data-table.svelte';

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Employees', route: '/admin/employees' }
	];
	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	console.log({ data });

	let for_table_data = $derived<EmployeeDataAdmin[]>(data.employees || []);

	
</script>

<div class="@container">

	<div class="mt-5 mb-10 flex flex-col @lg:flex-row @lg:items-center @lg:justify-between pe-4 lg:pe-6">
		<div class="grow">
			<HeaderPage title={'Employee Management'} message={'Manage your employees in here.'} />
		</div>
		
		<p class="flex gap-2 text-2xl font-medium items-center ms-4"><UsersRound/> {for_table_data.length} employees</p>
		
	</div>
</div>
	
<div class="mx-3">
	<DataTable data={for_table_data} {columns} />
</div>
