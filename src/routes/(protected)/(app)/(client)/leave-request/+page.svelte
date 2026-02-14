<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    $web_path_header = [{ path_name: "Leave Request", route: '/leave-request'}]

</script>

<HeaderPage title={'Leave Request'} message={'Submit a leave request by selecting the leave type, dates, and reason.'} />