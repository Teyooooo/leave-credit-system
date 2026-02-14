<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import LeaveCards from '$lib/components/leave-cards.svelte';
	import { Input } from '$lib/components/ui/input';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { LeaveData } from '$lib/types/data';
	import { filterArray } from '$lib/utils/helper';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    
    $web_path_header = [{path_name: "Types of Leave", route: "#"}]

    let list_of_leave = $derived<LeaveData[]>(data.list_of_leave || [] )

	let searched_item = $state("")
	let filtered_item = $derived(filterArray<LeaveData>(searched_item, list_of_leave, 'name'))

</script>

<div class="mt-5 mb-10 me-5 flex items-center justify-between">
    <HeaderPage title={'Types of Leave'} message={'Browse the supported leave categories used for submitting leave requests'}/>
	<Input type="text" placeholder="Search types..." bind:value={searched_item} class="w-50"></Input>
</div>

<LeaveCards list_of_leave={filtered_item} />