import DataTableCreatedAtButton from "$lib/components/data-table/data-table-created-at-button.svelte";
import DataTableDepartmentButton from "$lib/components/data-table/data-table-department-button.svelte";
import DataTableEmailButton from "$lib/components/data-table/data-table-email-button.svelte";
import DataTableIdButton from "$lib/components/data-table/data-table-id-button.svelte";
import DataTableNameButton from "$lib/components/data-table/data-table-name-button.svelte";
import DataTablePositionButton from "$lib/components/data-table/data-table-position-button.svelte";
import DataTableVerifiedButton from "$lib/components/data-table/data-table-verified-button.svelte";
import EmployeeNameCell from "$lib/components/data-table/employee-name-cell.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { EmployeeDataAdmin } from "$lib/types/data";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";

export const columns: ColumnDef<EmployeeDataAdmin>[] = [
    {
        accessorKey: "name",
        header: ({ column }) =>
            renderComponent(DataTableNameButton, {
                onclick: column.getToggleSortingHandler(),
                column: column, // Add this
            }),
        cell: ({ row }) => {
            return renderComponent(EmployeeNameCell, {
                name: row.original.name,
                profile_pic: row.original.profile_pic,
                id: row.original.employee_id
            });
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) =>
        renderComponent(DataTableEmailButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
    },
    {
        accessorKey: "employee_id",
        header: ({ column }) =>
        renderComponent(DataTableIdButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
    },
    {
        accessorKey: "department",
        header: ({ column }) =>
        renderComponent(DataTableDepartmentButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
    },
    {
        accessorKey: "position",
        header: ({ column }) =>
        renderComponent(DataTablePositionButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) =>
        renderComponent(DataTableCreatedAtButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
        cell: ({ getValue }) => {
            const date = new Date(getValue<string>());
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    {
        accessorKey: "is_account_verified",
        header: ({ column }) =>
        renderComponent(DataTableVerifiedButton, {
            onclick: column.getToggleSortingHandler(),
            column: column, // Add this
        }),
        cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            // You can pass whatever you need from `row.original` to the component
            return renderComponent(DataTableActions, { data: row.original });
        },
    },
];