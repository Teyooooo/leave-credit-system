import EmployeeNameCell from "$lib/components/data-table/employee-name-cell.svelte";
import HistoryRequestTableAction from "$lib/components/history-request-table/history-request-table-action.svelte";
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
            return `${convertTimestamp(row.original.date_filed, 'numericFull')}`
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
            return `${convertTimestamp(row.original.leave_start, "numericMonthDay")} - ${convertTimestamp(row.original.leave_end, "numericMonthDay")}`;
        },
    },
    {
        accessorKey: "total_days",
        header: "Total Days",
    },
    {
        accessorKey: "hr_name",
        header: "Processed By",
        cell: ({row})=>{
            if(row.original.status === 'Decline' && row.original.hr_name === '-'){
                return 'Department Head'
            }
            return row.original.hr_name
        }
    },
    {
        accessorKey: "processed_at",
        header: "Processed At",
        cell: ({row}) => {
            return `${convertTimestamp(row.original.processed_at, 'numericDate')}`
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
        id: "actions",
        cell: ({ row }) => {
        // You can pass whatever you need from `row.original` to the component
        return renderComponent(HistoryRequestTableAction, { data: row.original });
        },
    }
];