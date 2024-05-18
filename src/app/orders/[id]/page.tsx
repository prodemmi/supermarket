"use client"

import "./page.css";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useEffect, useMemo, useRef} from "react";
import useOrder from "@/composables/useOrder";
import {Order, OrderItem} from "@/types/order.d";
import {ToFaDate} from "@/utils/date";
import FlatButton from "@/components/FlatButton/FlatButton";
import InfoIcon from "@/components/Icons/InfoIcon";
import Badge from "@/components/Badge/Badge";
import AddressIcon from "@/components/Icons/AddressIcon";
import CardIcon from "@/components/Icons/CardIcon";
import {ORDER_PAY_TYPES, ORDER_STATUSES} from "@/enums/orders";
import {getOrderStatusColor} from "@/utils/color";
import DataTable from "@/components/DataTable/DataTable";
import {createColumnHelper, SortingFnOption} from "@tanstack/react-table";
import {toTomanCurrency} from "@/utils/number";
import {useLocalStorage} from "usehooks-ts";
import moment from "jalali-moment";
import {exportToPdf} from "@/utils/pdf";
import Button from "@/components/Button/Button";
import {exportToCsv} from "@/utils/csv";

export default function OrderDetail() {
    const orderService = useOrder()
    const params = useParams()
    const router = useRouter()
    const order = useMemo<Order>(() => orderService.findOne(params?.id as string), [params?.id])
    const [orderStore, setOrderStore] = useLocalStorage<Order>("order", order)

    useEffect(() => {
        if (order) {
            setOrderStore(order)
        }
    }, [order])

    const [day, year, month, time] = useMemo<string[]>(() => {
        const day = ToFaDate(orderStore.orderDate, "DD")
        const year = ToFaDate(orderStore.orderDate, "YYYY")
        const month = ToFaDate(orderStore.orderDate, "jMMMM")
        const time = ToFaDate(orderStore.orderDate, "HH:ss")

        return [day, year, month, time]
    }, [params?.id])
    const tableRef = useRef(null);
    const orderItemsColumnHelper = createColumnHelper<OrderItem>()

    const sortFn = (field: keyof OrderItem | string): SortingFnOption<OrderItem> | undefined => {
        return function (rowA, rowB, _columnId) {
            // @ts-ignore
            const A = rowA.original[field]
            // @ts-ignore
            const B = rowB.original[field]

            try {
                // @ts-ignore
                return A - B
            } catch (e) {
                return null
            }
        } as SortingFnOption<OrderItem> | undefined
    }

    const orderItemColumns = [
        orderItemsColumnHelper.accessor('productName', {
            header: "شرح کالا",
            cell: info => {

                return (
                    <div className="text-right">
                        <div className="item-name">
                            {info.getValue()}
                        </div>
                        <div>
                            <span>کدکالا:</span>
                            <span className="mr-10">{orderStore.trackerCode}</span>
                        </div>
                    </div>

                )
            },
            sortingFn: sortFn('productName'),
            meta: {
                filterVariant: 'text',
                key: "productName"
            },
        }),
        orderItemsColumnHelper.accessor('count', {
            header: "تعداد",
            cell: info => info.getValue(),
            sortingFn: sortFn('count'),
            meta: {
                filterVariant: 'number',
                key: "count"
            },
        }),
        orderItemsColumnHelper.accessor('price', {
            header: "قیمت واحد",
            cell: info => {

                return (
                    <div className="price-cell">
                        <span>{toTomanCurrency(info.getValue())}</span>
                        <span>تومان</span>
                    </div>
                )
            },
            sortingFn: sortFn('price'),
            meta: {
                filterVariant: 'text',
                key: "price",
                isPrice: true,
            },
        }),
        orderItemsColumnHelper.accessor("totalPrice", {
            id: "totalPrice",
            header: "مبلغ کل",
            cell: info => {

                return (
                    <div className="price-cell">
                        <span>{toTomanCurrency(info.row.original.totalPrice)}</span>
                        <span>تومان</span>
                    </div>
                )
            },
            sortingFn: sortFn('totalPrice'),
            meta: {
                filterVariant: 'number',
                key: "totalPrice",
                isPrice: true,
            },
        }),
    ];
    const goToBack = () => {
        router.back()
    }

    const getTotalAmount = useCallback(() => {
        const amount = orderStore.deliveryAmount + orderStore.taxAmount
        return toTomanCurrency(amount - orderStore.discountAmount)
    }, [orderStore])

    const exportDataTable = async () => {
        const now = moment(new Date()).format("YYYY-MM-DD").toString()
        // @ts-ignore
        const cols = tableRef?.current?.getCols() || []
        // @ts-ignore
        const rows = tableRef?.current?.getRows() || []

        exportToCsv(orderItemColumns?.map((col) => col?.meta?.key), rows?.map((row) => row.original), `${now}-CSV`)
        exportToPdf(orderItemColumns, rows, `${now}-PDF`)
    }

    return (
        <div className="order-detail-container flex gap-80">
            <div className="flex flex-col items-start w-full gap-80">
                <div className="flex flex-col gap-20">
                    <div>
                        <h2 className="order-detail-header">سفارش شماره‌ی {orderStore.orderId}</h2>
                        <div className="flex items-center gap-20">
                            <p>تهیه شده در {day} {month} {year} ساعت {time}</p>
                            <p>کد رهگیری سفارش: {orderStore.shipmentCode}</p>
                        </div>
                    </div>
                    <div className="backto-orders-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.1701 19C10.3195 19.0005 10.4671 18.9675 10.6021 18.9035C10.737 18.8395 10.856 18.746 10.9501 18.63L15.7801 12.63C15.9272 12.4511 16.0076 12.2266 16.0076 11.995C16.0076 11.7634 15.9272 11.5389 15.7801 11.36L10.7801 5.36C10.6103 5.15578 10.3664 5.02736 10.102 5.00298C9.83758 4.9786 9.5743 5.06026 9.37008 5.23C9.16586 5.39974 9.03744 5.64365 9.01306 5.90808C8.98868 6.1725 9.07034 6.43578 9.24008 6.64L13.7101 12L9.39008 17.36C9.2678 17.5068 9.19012 17.6855 9.16624 17.8751C9.14236 18.0646 9.17328 18.257 9.25533 18.4296C9.33739 18.6021 9.46715 18.7475 9.62926 18.8486C9.79137 18.9497 9.97905 19.0022 10.1701 19Z"
                                fill="#1577E6"/>
                        </svg>
                        <span onClick={goToBack}>بازگشت به سفارش های من</span>
                    </div>
                </div>
                <div className="col-on-mobile flex justify-stretch gap-20 w-full">
                    <div className="flex-1">
                        <div className="flex flex-col gap-20">
                            <Button
                                onClick={exportDataTable}
                                title={"دانلود فاکتور"}
                                color="primary"
                                outline={true}/>
                            <DataTable id={'order-detail-table'}
                                       ref={tableRef}
                                       columns={orderItemColumns} data={orderStore.orderItems} loading={false}
                                       onFetchMore={() => {
                                       }}/>
                        </div>
                        <div
                            className="detail-labels-contaienr flex w-full justify-end border-b-1 border-r-1 border-checkout-light-200">
                            <div className="detail-labels">
                                <div>هزینه ارسال</div>
                                <div>جمع تخفیف</div>
                                <div>مالیات</div>
                                <div className="font-bold">جـــــمع کـل</div>
                            </div>
                            <div className="detail-labels detail-blue-color">
                                <div>
                                    <span>{toTomanCurrency(orderStore.deliveryAmount)}</span>
                                    <span>تومان</span>
                                </div>
                                <div>
                                    <span>{toTomanCurrency(orderStore.discountAmount)}</span>
                                    <span>تومان</span>
                                </div>
                                <div>
                                    <span>{toTomanCurrency(orderStore.taxAmount)}</span>
                                    <span>تومان</span>
                                </div>
                                <div>
                                    <span>{getTotalAmount()}</span>
                                    <span>تومان</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-20">
                        <div className="detail flex flex-col gap-40">
                            <div className="flex flex-col justify-start gap-10">
                                <FlatButton title="وضعیت سفارش" color="gray" icon={<InfoIcon/>}/>
                                <Badge title={ORDER_STATUSES[orderStore.orderStatus]}
                                       color={getOrderStatusColor(orderStore.orderStatus)}/>
                            </div>
                            <div>
                                <FlatButton title="آدرس پستی سفارش" color="gray" icon={<AddressIcon/>}/>
                                <p>فاز ۴ شهرک غرب، خ. استاد شجریان، خ. درخشان، ک. چهارم ، تهران، ۱۲۳۴۵۶۷۸۹۰ </p>
                            </div>
                            <div>
                                <FlatButton title="نحوه‌ی پرداخت" color="gray" icon={<CardIcon/>}/>
                                <p>{ORDER_PAY_TYPES[orderStore.paymentMethod]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}