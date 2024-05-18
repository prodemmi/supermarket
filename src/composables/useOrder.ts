import {Order} from "@/types/order.d";
import appAxios from "@/axios/axios";
import {useSelector} from "react-redux";
import {selectOrders} from "@/stores/features/order/orderSlice";

export default function useOrder() {
    const orders = useSelector(selectOrders)

    const findAll = async (page: number = 1) => {
        let data: Order[] = []
        try {
            data = (await appAxios(`api/orders/${page}`, "GET")).data
        } catch (e) {
            throw e
        }

        return data
    }

    const findOne = (id: string) => {
        return orders.find((order: Order) => order?.id === id)
    }

    return {
        findAll,
        findOne,
    }
}