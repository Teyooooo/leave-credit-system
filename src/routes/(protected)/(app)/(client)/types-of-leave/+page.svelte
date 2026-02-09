<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import LeaveCards from '$lib/components/leave-cards.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { LeaveData } from '$lib/types/data';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    
    $web_path_header = [{path_name: "Types of Leave", route: "#"}]

    let list_of_leave = $derived<LeaveData[]>(data.list_of_leave || [] )

</script>

<div class="mt-5 mb-10">
    <HeaderPage title={'Types of Leave'} message={'Browse the supported leave categories used for submitting leave requests'}/>
</div>

<LeaveCards {list_of_leave} />