<script lang="ts">
	import Greetings from '$lib/components/greetings.svelte';
	import SectionCards from '$lib/components/section-cards.svelte';
	import { web_path_header } from '$lib/store/webDesignStore.js';

	export let data;
	let { employee } = data;

	$web_path_header = [
		{ path_name: 'Dashboard', route: '#' }
	];
</script>

<Greetings {employee} />
<SectionCards />
