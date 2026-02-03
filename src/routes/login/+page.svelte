<script lang="ts">
	import ctu_building from "$lib/assets/ctu_building.png";
	import LoginForm from "$lib/components/login-form.svelte";
	import { logo, title } from "$lib/store/webDesignStore";
	import type { LoginFormResult } from "$lib/types/auth";


	export let form: LoginFormResult | null;

</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="##" class="flex items-center gap-2 font-medium">
				<div
					class="bg-transparent text-primary-foreground flex size-6 items-center justify-center rounded-md"
				>
					<img src="{logo}" alt="logo" class="size-6">
				</div>
				{title}
			</a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginForm {form}/>
			</div>
		</div>
	</div>
	<div class="bg-muted relative hidden lg:block">
		<img
			src="{ctu_building}"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
		/>
	</div>
</div>
