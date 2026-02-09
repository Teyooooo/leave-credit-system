<script lang="ts">
	import IDForm from "$lib/components/id-form.svelte";
	import { logo, title } from "$lib/store/webDesignStore";

	export let form: { error: string } | null;
</script>



<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-xs flex-col gap-6">
		<a href="#/" class="flex items-center gap-2 self-center font-medium">
			<div
				class="bg-transparent text-primary-foreground flex size-6 items-center justify-center rounded-md"
			>
				<img src="{logo}" alt="logo" class="size-6">
			</div>
			{title}
		</a>
		<IDForm {form}/>
	</div>
</div>
