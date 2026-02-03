<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { logo, title } from "$lib/store/webDesignStore";
	import type { EmployeeData } from "$lib/types/data";
	import type { MenuItem } from "$lib/types/icon";
	import { FileUser, Gauge, Settings, ShieldUser, SquareChartGantt } from "@lucide/svelte/icons";
	import NavMain from "./nav/nav-main.svelte";
	import NavSecondary from "./nav/nav-secondary.svelte";
	import NavUser from "./nav/nav-user.svelte";

	export let employee: EmployeeData;


	const user = {
		name: employee.name,
		email: employee.email,
		avatar: employee.profilePic,
	}


	const navMain: MenuItem[] = [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: Gauge,
			},
			{
				title: "Activity Logs",
				url: "/activity-logs",
				icon: SquareChartGantt,
			},
			{
				title: "Account Information",
				url: "/account-info",
				icon: FileUser,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: Settings,
			},
		]

	const navSecondary: MenuItem[] = [
			{
				title: "Go to Admin",
				url: "/admin",
				icon: ShieldUser,
			},
			
		]

</script>

<Sidebar.Root collapsible="offcanvas" {...$$restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5! bg-transparent! dark:hover:text-sidebar-foreground!">
					<img src={logo} alt="Logo" class="size-7"/>
					<span class="text-base font-semibold">{title}</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain} />
		<NavSecondary items={navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={user} />
	</Sidebar.Footer>
</Sidebar.Root>
