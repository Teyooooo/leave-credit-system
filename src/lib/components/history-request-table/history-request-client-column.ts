import type { IssuedLeaveHistory } from "$lib/types/data";
import { convertTimestamp, parseLeavePointsSnapshot } from "$lib/utils/helper";
import type { ColumnDef } from "@tanstack/table-core";


export const columns: ColumnDef<IssuedLeaveHistory>[] = [
    {
        accessorKey: "created_at",
        header: "Issued At",
        cell: ({row}) => {
            return `${convertTimestamp(row.original.created_at, 'numericFull')}`
        },
    },
    {
        accessorKey: "leave_title",
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
        accessorKey: "leave_points_snapshot",
        header: "Points Before Deduction",
        cell: ({ row }) => {
            return `${parseLeavePointsSnapshot(row.original.leave_points_snapshot)}`
        }
    },
    {
        accessorKey: "total_days",
        header: "Total Days",
    },
    {
        accessorKey: "hr_name",
        header: "Issued By",
        cell: ({row})=>{
            return row.original.hr_name
        }
    }
];