import {flexRender} from "@tanstack/react-table";
import * as React from "react";

interface TableRowProps {
    row: any
}

export function TableRow(props: TableRowProps) {
    return (
        <tr key={props.row.id} className="border-b">
            {props.row.getVisibleCells().map((cell: any) => {
                return (
                    <td key={cell.id} data-label={cell?.column?.columnDef.header} className="px-4 pt-[14px] pb-[18px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                )
            })}
        </tr>
    )
}