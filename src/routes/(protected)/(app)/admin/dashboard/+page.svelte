<script lang="ts">
	import Greetings from '$lib/components/greetings.svelte';
	import LowLevelBalance from '$lib/components/low-level-balance.svelte';
	import SectionCardAdmin from '$lib/components/section-card-admin.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    let { employee } = $derived(data) 

    $web_path_header = [
		{ path_name: 'Admin', route: '#' },
		{ path_name: 'Dashboard', route: '#' }
	];
</script>

<Greetings {employee} />
<SectionCardAdmin />
<LowLevelBalance />
