<script lang="ts">
	import favicon from '$lib/assets/leave_credit_system_logo.png';
	import { ModeWatcher } from "mode-watcher";
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
{@render children()}
