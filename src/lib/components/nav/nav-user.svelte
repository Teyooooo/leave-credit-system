<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { LogOut } from "@lucide/svelte/icons";


	let { user }: { user: { name: string; email: string; avatar: string } } = $props();

	function getInitials(fullName: string): string {
    // Split the full name by spaces
    const names = fullName.trim().split(/\s+/);

    if (names.length === 0) return '';

    // Take the first letter of the first and last word only
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial;
}

	// svelte-ignore state_referenced_locally
		let callback_name = getInitials(user.name)

</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="bg-transparent! dark:hover:text-sidebar-foreground!"
		>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image src={user.avatar} alt={user.name} />
				<Avatar.Fallback class="rounded-lg">{callback_name}</Avatar.Fallback> 
			</Avatar.Root>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium">{user.name}</span>
				<span class="text-muted-foreground truncate text-xs">
					{user.email}
				</span>
			</div>
			<Button href='/auth/signout' class="dark:bg-amber-300 bg-amber-500 text-gray-900 hover:bg-amber-400 dark:hover:bg-amber-400">
				<LogOut class="ms-auto size-4" />
			</Button>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
