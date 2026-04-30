<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import PendingApprovalContainer from '$lib/components/pending-approval/pending-approval-container.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    $web_path_header = [
		{ path_name: 'Approve Request', route: '/approve-request' }
	];

    let { data }: PageProps = $props();
    let { pendingLeave, employee } = $derived(data)
</script>

<HeaderPage title={"Approve Requests"} message={"Review and take action on employee leave requests in your role as a department head."} />

<div class="mx-6 min-h-96 w-[100%-1.5rem] grid gap-4">
	<PendingApprovalContainer filedLeave={pendingLeave} historyRoute={'/approve-request/history'} revieweeInfo={employee} />
</div>