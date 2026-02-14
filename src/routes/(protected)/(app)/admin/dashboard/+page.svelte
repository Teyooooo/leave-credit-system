<script lang="ts">
	import Greetings from '$lib/components/greetings.svelte';
	import SectionCardAdmin from '$lib/components/section-card-admin.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';
	import TableLowLevelBalance from '$lib/components/table-low-level-balance.svelte';

    let { data }: PageProps = $props();
    let { employee } = $derived(data) 

    $web_path_header = [
		{ path_name: 'Admin', route: '#' },
		{ path_name: 'Dashboard', route: '#' }
	];
</script>

<Greetings {employee} />
<SectionCardAdmin />
<TableLowLevelBalance />
