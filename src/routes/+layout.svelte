<script lang="ts">
	import favicon from '$lib/assets/leave_credit_system_logo.png';
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Toaster position="top-right" richColors />
<ModeWatcher />
{@render children()}
