<script lang="ts">
	import { page } from "$app/state";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { logo, title } from "$lib/store/webDesignStore";
	import type { EmployeeData } from "$lib/types/data";
	import type { MenuItem } from "$lib/types/icon";
	import { ArrowLeft, CalendarFold, FilePenLine, Gauge, LibraryBig, Settings2, ShieldUser, SquareChartGantt, UserRound, UsersRound } from "@lucide/svelte/icons";
	import NavMain from "./nav/nav-main.svelte";
	import NavSecondary from "./nav/nav-secondary.svelte";
	import NavUser from "./nav/nav-user.svelte";

	let { employee, ...rest }: {employee: EmployeeData} = $props();

	const pathname = $derived(page.url.pathname);
	const isAdminRoute = $derived(pathname.startsWith("/admin"));
	const isUserAdmin = $derived(employee.role_in_system === 'Admin')

	const user = $derived({
		name: employee.name,
		email: employee.email,
		avatar: employee.profile_pic,
	})


	const navMain: MenuItem[] = [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: Gauge,
			},
			{
				title: "Leave Request",
				url: "/leave-request",
				icon: FilePenLine,
			},
			{
				title: "Monthly Points Issued",
				url: "/monthly-points-issued",
				icon: CalendarFold,
			},
			{
				title: "Account Information",
				url: "/account-info",
				icon: UserRound,
			},
			{
				title: "Types of Leave",
				url: "/types-of-leave",
				icon: LibraryBig,
			},
		]

	const adminNavMain: MenuItem[] = [
			{
				title: "Dashboard",
				url: "/admin/dashboard",
				icon: Gauge,
			},
			{
				title: "Requests",
				url: "/admin/requests",
				icon: SquareChartGantt,
			},
			{
				title: "Employees",
				url: "/admin/employees",
				icon: UsersRound,
			},
			{
				title: "Types of Leave",
				url: "/admin/types-of-leave",
				icon: LibraryBig,
			},
			{
				title: "Settings",
				url: "/admin/settings",
				icon: Settings2
			}

		]

	const navSecondary: MenuItem[] = $derived([
			{
				title: isAdminRoute ? "Back to User" : "Go to Admin",
				url: isAdminRoute ? "/dashboard" : "/admin",
				icon: isAdminRoute ? ArrowLeft : ShieldUser,
			},
			
		])

</script>

<Sidebar.Root collapsible="offcanvas" {...rest}>
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
		<NavMain items={isAdminRoute ? adminNavMain : navMain} />
		<NavSecondary items={isUserAdmin ? navSecondary : []} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={user} />
	</Sidebar.Footer>
</Sidebar.Root>
