<script lang="ts">
	import { page } from '$app/state';
	import ctu_building from '$lib/assets/ctu_building.png';
	import LoginForm from '$lib/components/login-form.svelte';
	import { logo, title } from '$lib/store/webDesignStore';
	import type { LoginFormResult } from '$lib/types/auth';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	onMount(() => {
		const error = page.url.searchParams.get('error');
		if (error === 'account_deleted') {
			toast.error('Your account is deleted. Please contact HR for assistance.');
		}else if (error === 'account_not_found'){
			toast.error('Account not found. Please contact HR for assistance.');
		}
	});

	export let form: LoginFormResult | null;
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="##" class="flex items-center gap-2 font-medium">
				<div
					class="flex size-6 items-center justify-center rounded-md bg-transparent text-primary-foreground"
				>
					<img src={logo} alt="logo" class="size-6" />
				</div>
				{title}
			</a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginForm {form} />
			</div>
		</div>
	</div>
	<div class="relative hidden bg-muted lg:block">
		<img
			src={ctu_building}
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
		/>
	</div>
</div>
