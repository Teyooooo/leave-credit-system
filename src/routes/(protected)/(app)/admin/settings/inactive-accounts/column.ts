import DataTableCreatedAtButton from "$lib/components/data-table/data-table-created-at-button.svelte";
import DataTableEmailButton from "$lib/components/data-table/data-table-email-button.svelte";
import DataTableIdButton from "$lib/components/data-table/data-table-id-button.svelte";
import DataTableNameButton from "$lib/components/data-table/data-table-name-button.svelte";
import EmployeeNameCell from "$lib/components/data-table/employee-name-cell.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { EmployeeDataAdmin } from "$lib/types/data";
import { convertTimestamp } from "$lib/utils/helper";
import type { ColumnDef } from "@tanstack/table-core";
import ReActiveButton from "./re-active-button.svelte";

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
    // {
    //     accessorKey: "department",
    //     header: ({ column }) =>
    //         renderComponent(DataTableDepartmentButton, {
    //             onclick: column.getToggleSortingHandler(),
    //             column: column, // Add this
    //         }),
    // },
    // {
    //     accessorKey: "position",
    //     header: ({ column }) =>
    //         renderComponent(DataTablePositionButton, {
    //             onclick: column.getToggleSortingHandler(),
    //             column: column, // Add this
    //         }),
    // },
    {
        accessorKey: "created_at",
        header: ({ column }) =>
            renderComponent(DataTableCreatedAtButton, {
                onclick: column.getToggleSortingHandler(),
                column: column, // Add this
            }),
        cell: ({ getValue }) => {
            return convertTimestamp(getValue<string>(), "full");
            ;
        }
    },
    {
        accessorKey: "role_in_system",
        header: "System Role"
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            return renderComponent(ReActiveButton, { data: row.original });
        },
    },
];