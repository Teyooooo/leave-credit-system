import DataTableTimestampButton from "$lib/components/data-table/data-table-timestamp-button.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { ActivityLogsEmployee } from "$lib/types/data";
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
        accessorKey: "details",
        header: "Details",
    },
];