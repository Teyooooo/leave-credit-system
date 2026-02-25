<script lang="ts">
	import { ArrowLeft } from "@lucide/svelte";
	import { Button } from "./ui/button";

	let { route }: { route: string } = $props();

	let hovered = $state(false);
</script>

<Button
	class="back-btn w-fit ms-4 overflow-hidden transition-all duration-300"
	href={route}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<ArrowLeft class="shrink-0 transition-transform duration-300 {hovered ? '-translate-x-0.5' : 'ms-2'}" />
	<span
		class="overflow-hidden whitespace-nowrap transition-all duration-300 {hovered
			? 'max-w-20 opacity-100 ml-1'
			: 'max-w-0 opacity-0 ml-0 p-0'}"
	>
		Back
	</span>
</Button>