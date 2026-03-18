import DataTableNameButton from "$lib/components/data-table/data-table-name-button.svelte";
import DataTableTimestampButton from "$lib/components/data-table/data-table-timestamp-button.svelte";
import EmployeeNameCell from "$lib/components/data-table/employee-name-cell.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { ActivityLogsAdmin } from "$lib/types/data";
import { convertTimestamp } from "$lib/utils/helper";
import type { ColumnDef } from "@tanstack/table-core";


export const columns: ColumnDef<ActivityLogsAdmin>[] = [
    {
        accessorKey: "timestamp",
        header: ({ column }) =>
            renderComponent(DataTableTimestampButton, {
                onclick: column.getToggleSortingHandler(),
                column: column, // Add this
            }),
        cell: ({ getValue }) => {
            return convertTimestamp(getValue<string>(), "full");
            ;
        }
    },
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
            });
        },
    },
    {
        accessorKey: "details",
        header: "Details",
    },
];