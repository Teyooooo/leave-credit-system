<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import SettingsButtons from '$lib/components/settings-buttons.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' }
	];

</script>

<HeaderPage title={'Settings'}/>

<SettingsButtons />