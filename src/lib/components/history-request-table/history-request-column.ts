import EmployeeNameCell from "$lib/components/data-table/employee-name-cell.svelte";
import DownloadCell from "$lib/components/history-request-table/download-cell.svelte";
import StatusCell from "$lib/components/history-request-table/status-cell.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { LeaveHistory } from "$lib/types/data";
import { convertTimestamp } from "$lib/utils/helper";
import type { ColumnDef } from "@tanstack/table-core";


export const columns: ColumnDef<LeaveHistory>[] = [
    {
        accessorKey: "employee_name",
        header: "Filed By",
        cell: ({ row }) => {
            return renderComponent(EmployeeNameCell, {
                name: row.original.employee_name,
                profile_pic: row.original.profile_pic_url,
                id: Number(row.original.employee_id)
            });
        },
    },
    {
        accessorKey: "date_filed",
        header: "Filed At",
        cell: ({row}) => {
            return `${convertTimestamp(row.original.date_filed, 'full')}`
        },
    },
    {
        accessorKey: "type_leave",
        header: "Type of Leave",
    },
    {
        accessorKey: "leave_start",
        header: "Leave Date",
        cell: ({ row }) => {
            return `${convertTimestamp(row.original.leave_start, "date")} - ${convertTimestamp(row.original.leave_end, "date")}`;
        },
    },
    {
        accessorKey: "total_days",
        header: "Total Days",
    },
    {
        accessorKey: "hr_name",
        header: "Processed By",
    },
    {
        accessorKey: "processed_at",
        header: "Processed At",
        cell: ({row}) => {
            return `${convertTimestamp(row.original.processed_at, 'full')}`
        },
    }
    ,
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return renderComponent(StatusCell, {
                status: row.original.status,
            });
        },
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
        return renderComponent(DownloadCell, {
            data: row.original,
        });
    },
    }
];