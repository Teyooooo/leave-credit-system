<script lang="ts">
	import Greetings from '$lib/components/greetings.svelte';
	import SectionCardAdmin from '$lib/components/section-card-admin.svelte';
	import TableLowLevelBalance from '$lib/components/table-low-level-balance.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    $web_path_header = [
		{ path_name: 'Admin', route: '#' },
		{ path_name: 'Dashboard', route: '#' }
	];

    let { data }: PageProps = $props();
    let { employee, cardInfo, lowPoints } = $derived(data) 


</script>

<Greetings {employee} />
<SectionCardAdmin data={cardInfo} />
<TableLowLevelBalance data={lowPoints} />
