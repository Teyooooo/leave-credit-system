<script lang="ts">
	import SectionCards from "$lib/components/section-cards.svelte";
	import { web_path_header } from "$lib/store/webDesignStore.js";

	export let data
	let { employee } = data;
	
	$web_path_header = `Welcome, ${employee.name}`

</script>

<SectionCards />