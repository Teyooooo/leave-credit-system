<script lang="ts">
	import IDForm from "$lib/components/id-form.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { logo, title } from "$lib/store/webDesignStore";
	import { LogOut } from "@lucide/svelte";

	export let form: { error: string } | null;
</script>

<div class="bg-muted min-h-svh flex flex-col gap-3 p-2 md:p-4 w-full h-full">

	<Button href='/auth/signout' class='w-30'><LogOut /> Log out</Button>

	<div class="grow flex flex-col items-center justify-center w-full">
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
</div>
