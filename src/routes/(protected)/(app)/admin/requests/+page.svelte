<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import PendingApprovalContainer from '$lib/components/pending-approval/pending-approval-container.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Requests', route: '/admin/dashboard/requests' }
	];

	let { employee, pendingLeave } = $derived(data)

</script>

<HeaderPage title={"Requests"} message={"Review, approve, or reject employee leave requests in accordance with company policy."} />

<div class="mx-6 min-h-96 w-[100%-1.5rem] grid gap-4">
	<PendingApprovalContainer filedLeave={pendingLeave} hrInfo={employee} />
</div>