"use client"

import "./orders.css";
import FlatButton from "@/components/FlatButton/FlatButton";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import {Order,} from "@/types/order.d";
import {createColumnHelper, SortingFnOption} from "@tanstack/react-table";
import {useEffect, useRef, useState} from "react";
import useOrder from "@/composables/useOrder";
import {ToFaDate} from "@/utils/date";
import {ORDER_PAY_TYPES, ORDER_STATUSES} from "@/enums/orders";
import Badge from "@/components/Badge/Badge";
import {toTomanCurrency} from "@/utils/number";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchOrders,
    selectLoading,
    selectOrders,
    setLoadingMoreOrders,
    setLoadingOrders
} from "@/stores/features/order/orderSlice";
import Link from "next/link";
import {getOrderStatusColor} from "@/utils/color";
import moment from "jalali-moment";

export default function Page() {
    const dispatch = useDispatch()
    const orderService = useOrder()
    const orderColumnHelper = createColumnHelper<Order>()

    const sortFn = (field: keyof Order): SortingFnOption<Order> | undefined => {
        return function (rowA, rowB, _columnId) {
            const A = rowA.original[field]
            const B = rowB.original[field]

            try {
                // @ts-ignore
                return A - B
            } catch (e) {
                return null
            }
        } as SortingFnOption<Order> | undefined
    }

    const orderColumns = [
        orderColumnHelper.accessor('orderId', {
            header: "شماره‌ی سفارش",
            cell: info => info.getValue(),
            sortingFn: sortFn('orderId'),
            meta: {
                filterVariant: 'number',
            },
            filterFn: 'includesString',
        }),
        orderColumnHelper.accessor('orderDate', {
            header: "تاریخ",
            cell: info => <span className="table-order-date-cell">{ToFaDate(info.getValue())}</span>,
            enableSorting: true,
            meta: {
                filterVariant: 'date',
            },
            filterFn: (row, columnId, filterValue) => {
                try {
                    const value = moment(filterValue).format("jYYYY/jMM/jDD")
                    const orderDate = moment(row.original.orderDate).format("jYYYY/jMM/jDD")
                    return value === orderDate
                } catch (e) {
                    return false
                }
            },
        }),
        orderColumnHelper.accessor('paymentMethod', {
            header: "نحوه‌ی پرداخت",
            cell: info => {
                try {
                    return ORDER_PAY_TYPES[info.getValue()]
                } catch (e) {
                }

                return "-"
            },
            sortingFn: sortFn('paymentMethod'),
            meta: {
                filterVariant: 'select',
                options: ORDER_PAY_TYPES
            },
        }),
        orderColumnHelper.accessor('orderStatus', {
            header: "وضعیت سفارش",
            cell: info => {
                const value = info.getValue()
                try {
                    const text = ORDER_STATUSES[value] || '-'

                    if (value === 3) {
                        return (<div>
                            <Badge center={true} title={text} color={getOrderStatusColor(value)}/>
                            <span className="pay-link">پرداخت</span>
                        </div>)
                    }

                    return <Badge center={true} title={text} color={getOrderStatusColor(value)}/>
                } catch (e) {
                }

                return "-"
            },
            sortingFn: sortFn('orderStatus'),
            meta: {
                filterVariant: 'select',
                options: ORDER_STATUSES
            },
        }),
        orderColumnHelper.accessor('taxAmount', {
            header: "مبلغ کل",
            cell: info => (
                <div className="text-black-900">{toTomanCurrency(info.getValue())} <span>تومان</span></div>
            ),
            sortingFn: sortFn('taxAmount'),
            meta: {
                filterVariant: 'number',
            },
            filterFn: 'includesString',
        }),
        orderColumnHelper.accessor('postalCode', {
            header: "کد مرسوله پستی",
            cell: info => info.getValue(),
            sortingFn: sortFn('postalCode'),
            meta: {
                filterVariant: 'number',
            },
            filterFn: 'includesString',
        }),
        orderColumnHelper.display({
            id: "sdsd",
            header: " ",
            cell: (info) => {
                return (
                    <div className="show-detail">
                        <Link href={`orders/${info.row.original.id}`}>مشاهده جزئیات</Link>
                    </div>
                )
            },
        }),
    ]

    const [page, setPage] = useState<number>(1)
    const tableData = useSelector(selectOrders)
    const tableLoading = useSelector(selectLoading)
    const initializedDataTable = useRef(false)

    const initData = async () => {
        if (!initializedDataTable.current) {
            dispatch(setLoadingOrders(true));
            dispatch(fetchOrders(await orderService.findAll()));
            dispatch(setLoadingOrders(false));
            initializedDataTable.current = true
        }
    }

    const fetchMoreData = async () => {
        setPage(page + 1)
        if (page < 4) {
            dispatch(setLoadingMoreOrders(true))
            dispatch(fetchOrders(await orderService.findAll(page)));
            dispatch(setLoadingMoreOrders(false))
        }
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <div className="order-container flex items-start gap-40">
            <div className="flex flex-col gap-20 w-full">
                <h3 className="header-title">سفارش های من</h3>
                <div>
                    <DataTable data={(tableData || []) as any[]}
                               columns={orderColumns}
                               loading={tableLoading}
                               showFilters={true}
                               onFetchMore={fetchMoreData}/>
                </div>
            </div>
            <div>
                <div className="flex flex-col gap-20">
                    <div>
                        <img className="profile-image" src="profile.png" alt=""/>
                        <h3 className="profile-header-title">سعید کرمی</h3>
                        <p className="profile-number">۰۹۱۲۳۴۵۶۷۸۹</p>
                    </div>
                    <div style={{width: "340px"}}>
                        <div className="profile-address_header">آدرس</div>
                        <p className="profile-address_body">فاز ۴ شهرک غرب، خ. استاد شجریان، خ. درخشان، ک. چهارم ،
                            تهران،
                            ۱۲۳۴۵۶۷۸۹۰ </p>
                    </div>
                </div>
                <div className="flex flex-col gap-10 my-40">
                    <FlatButton icon={<EditIcon/>} title="ویرایش اطلاعات" color="primary"/>
                    <FlatButton icon={<DeleteIcon/>} title="خروج از حساب" color="danger"/>
                </div>
                <div className="profile_info">
                    <div className="profile_info--header">شما عضو گروه طلایی هستید!</div>
                    <div>
                        <div className="profile_info--detail">
                            <div>سقف خرید اعتباری</div>
                            <div className="flex items-center gap-4">
                                25,000,000
                                <span>تومان</span>
                            </div>
                        </div>
                        <div className="profile_info--detail">
                            <div>موجودی کیف پول شما</div>
                            <div className="flex items-center gap-4">
                                50,000,000
                                <span>تومان</span>
                            </div>
                        </div>
                    </div>
                    <Button title="شارژ کیف پول" color="primary"/>
                </div>
            </div>
        </div>
    );
}