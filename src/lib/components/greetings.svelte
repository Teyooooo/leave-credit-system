<script lang="ts">
	import { page } from '$app/state';
	import { user_name } from '$lib/store/webDesignStore';

	let { employee } = $props();

	let displayName = $derived($user_name || employee.name);
	const path_name = $derived(page.url.pathname);
	const isRouteInAdmin = $derived(path_name.startsWith('/admin'));

</script>

<div class="px-4 lg:px-6">
	<h1 class="text-4xl font-bold">Hi, {isRouteInAdmin ? 'Admin' : ''} {displayName}!</h1>
	<p class="text-sm/6">
		{isRouteInAdmin
			? 'You’re in control of leave credits and approvals.'
			: 'View your leave balance, submit requests, and monitor approvals here.'}
	</p>
</div>
