<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { departments, web_path_header } from '$lib/store/webDesignStore';
	import type { EmployeeDataAdmin } from '$lib/types/data';
	import { UsersRound } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { columns } from './column';
	import DataTable from './data-table.svelte';

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' },
		{ path_name: 'Inactive Accounts', route: '/admin/settings/inactive-accounts' }
	];

	let { data }: PageProps = $props();
    
	let for_table_data = $derived<EmployeeDataAdmin[]>(data.inactiveEmployees || []);

	onMount(() => {
		$departments = [...data.listOfDepartments];
	});

	
</script>

<div class="@container">

	<div class="mt-5 mb-10 flex flex-col @lg:flex-row @lg:items-center @lg:justify-between pe-4 lg:pe-6">
		<div class="grow">
			<HeaderPage title={'Inactive Accounts'} message={'Manage inactive accounts in here.'} />
		</div>
		
		<p class="flex gap-2 text-2xl font-medium items-center ms-4"><UsersRound/> {for_table_data.length} inactive accounts</p>
		
	</div>
</div>
	
<div class="mx-3">
	<DataTable data={for_table_data} {columns} />
</div>
