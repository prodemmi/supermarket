"use client"

import './DataTable.css'
import * as React from 'react'
import {forwardRef, useImperativeHandle, useRef} from 'react'

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {TableRow} from "@/components/DataTable/TableRow";
import Spinner from "@/components/Spinner/Spinner";
import {useVirtualizer} from "@tanstack/react-virtual";
import {selectLoadingMore} from "@/stores/features/order/orderSlice";
import {useSelector} from "react-redux";
import Filter from './Filter'

interface Props {
    id?: string
    columns: any[]
    data: any[]
    loading: boolean
    onFetchMore: Function
    showFilters?: boolean
}

const DataTable = forwardRef(function DataTable(props: Props, ref) {
    const loadingMore = useSelector(selectLoadingMore)
    const tableContainerRef = useRef<HTMLTableElement | undefined>()
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const table = useReactTable({
        data: props.data,
        columns: props.columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: props.showFilters ? getFilteredRowModel() : undefined,
        state: props.showFilters ? {
            columnFilters,
        } : undefined,
        onColumnFiltersChange: props.showFilters ? setColumnFilters : undefined,
    })

    useImperativeHandle(ref, () => {
        return {
            table() {
                return table
            },
            getRows() {
                return table.getCoreRowModel().rows
            },
            getCols() {
                return table.getAllColumns().map((col) => col.columnDef.header)
            },
        }
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: props.data?.length || 0,
        estimateSize: () => 64.5,
        getScrollElement: () => tableContainerRef.current!,
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? element => element?.getBoundingClientRect().height
                : undefined,
        overscan: 5,
    })

    const fetchMore = React.useCallback(
        async (containerRefElement?: HTMLElement | null) => {
            if (containerRefElement) {
                const {scrollHeight, scrollTop, clientHeight} = containerRefElement
                if (scrollHeight - scrollTop - clientHeight === 0 && !loadingMore && !rowVirtualizer.isScrolling) {
                    await props.onFetchMore()
                    rowVirtualizer.scrollToIndex(scrollHeight)
                }
            }
        },
        [props.onFetchMore]
    )

    const Rows = () => {
        if (props.loading) {
            return (
                <tr>
                    <td><Spinner/></td>
                </tr>
            )
        }

        return table.getRowModel().rows.map((row, index) => (
            <TableRow row={row} key={index}/>
        ))
    }

    return (
        <div className="data-table">
            {/*@ts-ignore*/}
            <table id={props.id} ref={tableContainerRef}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={
                                                header.column.getCanSort()
                                                    ? header.column.getNextSortingOrder() === 'asc'
                                                        ? 'Sort ascending'
                                                        : header.column.getNextSortingOrder() === 'desc'
                                                            ? 'Sort descending'
                                                            : 'Clear sort'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                    {props.showFilters && typeof header.column.accessorFn !== "undefined" && header.column.getCanHide() &&
                                        <Filter onChange={(v: any) => header.column.setFilterValue(v)}
                                                column={header.column}/>
                                    }
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody onScroll={(e) => fetchMore(e.currentTarget)}>
                <Rows/>
                {loadingMore &&
                    <tr>
                        <Spinner/>
                    </tr>
                }
                </tbody>
            </table>
        </div>
    )
})

export default DataTable