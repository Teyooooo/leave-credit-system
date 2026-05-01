<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import EmployeeCard from '$lib/components/employee-card.svelte';
	import { columns } from '$lib/components/issued-log-table/issued-logs-column';
	import IssuedLogsTable from '$lib/components/issued-log-table/issued-logs-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { History } from '@lucide/svelte';
	import type { PageProps } from './$types';


	let { data }: PageProps = $props();

    const params = $derived(data.params || '#')
    const hr_info = $derived(data.employee)
    const current_employee_info = $derived(data.current_employee_info)
    const creditPoints = $derived(data.creditPoints)
    const issuedLogs = $derived(data.issuedLogs)
    const listsOfLeave = $derived(data.listsOfLeave)


    $effect(() => {
        $web_path_header = [
            { path_name: 'Admin', route: '/admin/dashboard' },
            { path_name: 'Employees', route: '/admin/employees' },
            { path_name: current_employee_info?.name || 'User', route: `/admin/employees/${params}` }
        ]

        console.log({issuedLogs})
    })

</script>

<BackButton route={"/admin/employees"} />

<EmployeeCard employee={current_employee_info} {creditPoints} {listsOfLeave} {hr_info}/>

<div>
    <div class="mx-3 flex justify-between items-center py-2">
        <p class="text-xl font-medium mb-3">Issued Logs</p>
        <!-- removed leave balance -->
        <!-- <Button href="/admin/employees/{params}/leave-balance-sheet">Show Leave Balance Sheet</Button> -->

        <Button href='/admin/requests/history?employee={current_employee_info?.name}'><History /> View Filed Leave History</Button>
    </div>
    <IssuedLogsTable data={issuedLogs || []} {columns} />
</div>
