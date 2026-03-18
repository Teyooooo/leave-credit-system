import DataTableTimestampButton from "$lib/components/data-table/data-table-timestamp-button.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { ActivityLogsEmployee } from "$lib/types/data";
import { convertTimestamp } from "$lib/utils/helper";
import type { ColumnDef } from "@tanstack/table-core";


export const columns: ColumnDef<ActivityLogsEmployee>[] = [
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
        accessorKey: "details",
        header: "Details",
    },
];