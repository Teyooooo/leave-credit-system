<script lang="ts">
	import favicon from '$lib/assets/leave_credit_system_logo.png';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { ModeWatcher } from "mode-watcher";
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} /> 
	<title>Leave Credit System</title>
</svelte:head>
<Toaster position="top-right" richColors />
<ModeWatcher />
{@render children()}
