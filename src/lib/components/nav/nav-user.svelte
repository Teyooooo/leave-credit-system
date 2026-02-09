<script lang="ts">
	import { getInitials } from "$lib";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { user_name } from "$lib/store/webDesignStore";
	import { LogOut } from "@lucide/svelte/icons";


	let { user }: { user: { name: string; email: string; avatar: string } } = $props();

	let displayName = $derived($user_name || user.name)
	let callback_name = $derived(getInitials(displayName))

</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="bg-transparent! dark:hover:text-sidebar-foreground!"
		>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image src={user.avatar} alt={displayName} />
				<Avatar.Fallback class="rounded-lg">{callback_name}</Avatar.Fallback> 
			</Avatar.Root>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium">{displayName}</span>
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
