<script lang="ts">
	import EmployeeCard from '$lib/components/employee-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { ArrowLeft } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import IssuedLogsTable from '$lib/components/issued-log-table/issued-logs-table.svelte';
	import { columns } from '$lib/components/issued-log-table/issued-logs-column';


	let { data }: PageProps = $props();

    const params = $derived(data.params || '#')
    const current_employee_info = $derived(data.current_employee_info)
    const creditPoints = $derived(data.creditPoints)
    const issuedLogs = $derived(data.issuedLogs)


    $effect(() => {
        $web_path_header = [
            { path_name: 'Admin', route: '/admin/dashboard' },
            { path_name: 'Employees', route: '/admin/employees' },
            { path_name: current_employee_info?.name || 'User', route: `/admin/employees/${params}` }
        ]

        console.log({issuedLogs})
    })

</script>

<Button class='w-fit ms-4' href="/admin/employees">
    <ArrowLeft />
</Button>

<EmployeeCard employee={current_employee_info} {creditPoints}/>

<div>
    <p class="text-xl font-medium mx-3 mb-3">Issued Logs</p>
    <IssuedLogsTable data={issuedLogs || []} {columns} />
</div>


