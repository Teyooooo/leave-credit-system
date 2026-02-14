
import { convertTimestamp } from "$lib";
import DataTableTimestampButton from "$lib/components/data-table/data-table-timestamp-button.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { IssuedLogs } from "$lib/types/data";
import type { ColumnDef } from "@tanstack/table-core";


export const columns: ColumnDef<IssuedLogs>[] = [
    {
        accessorKey: "created_at",
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
    accessorKey: "sick_leave_earned",
    header: "Sick leave Earned",
  },
  {
    accessorKey: "vacation_leave_earned",
    header: "Vacation Leave Earned",
  },
  {
    accessorKey: "late_per_mins",
    header: "Late",
  },
  {
    accessorKey: "sick_leave_balance",
    header: "Last Sick Leave Balance",
  },
  {
    accessorKey: "vacation_leave_balance",
    header: "Last Vacation Leave Balance",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  }
];