import {Column} from "@tanstack/react-table";
import * as React from "react";
import {forwardRef} from "react";
import {DatePicker} from "zaman";
import {DatePickerValue} from "zaman/dist/types";

// eslint-disable-next-line react/display-name
const Filter = forwardRef((props: { column: Column<any, unknown>, onChange: Function }, ref) => {
    const columnFilterValue = props.column.getFilterValue()
    // @ts-ignore
    const {filterVariant, options} = props.column.columnDef.meta ?? {}

    const onChangeValue = (v: any) => {
        props.onChange(v)
    }

    if (filterVariant === 'select') {
        return (
            <select
                // @ts-ignore
                ref={ref}
                onChange={(e) => onChangeValue(e.target.value)}
                value={columnFilterValue?.toString()}
            >
                <option value={undefined}>بدون فیلتر</option>
                {options?.map((option: string, index: number) => <option key={index}
                                                                         value={index}>{option}</option>)}
            </select>
        )
    }

    if (filterVariant === 'text') {
        return (
            <input
                // @ts-ignore
                ref={ref}
                className="w-36 px-2 border shadow rounded"
                onChange={(e) => onChangeValue(e.target.value)}
                placeholder={`جستجو...`}
                type="text"
                value={(columnFilterValue?.toString()) as string}
            />
        )
    }

    if (filterVariant === 'number') {
        return (
            <input
                // @ts-ignore
                ref={ref}
                className="w-36 px-2 border shadow rounded"
                onChange={(e) => onChangeValue(e.target.value)}
                placeholder={`جستجو...`}
                type="number"
                value={(columnFilterValue?.toString())}
            />
        )
    }

    if (filterVariant === 'date') {
        return (
            <div onDoubleClick={() => onChangeValue(undefined)}
                 className="border-1 border-gray-200 shadow rounded w-fit">
                <DatePicker
                    // @ts-ignore
                    ref={ref}
                    onChange={(v) => onChangeValue(v.value.toString())}
                    defaultValue={columnFilterValue as DatePickerValue}
                />
            </div>
        )
    }

    return <div></div>
})

export default Filter