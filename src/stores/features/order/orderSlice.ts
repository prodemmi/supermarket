import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Order} from "@/types/order.d";

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        loadingOrders: false,
        loadingMore: false,
    },
    reducers: {
        fetchOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = state.orders.concat(action.payload as never[])
        },
        setLoadingOrders: (state, action: PayloadAction<boolean>) => {
            state.loadingOrders = action.payload
        },
        setLoadingMoreOrders: (state, action: PayloadAction<boolean>) => {
            state.loadingMore = action.payload
        },
    },
})

export const {fetchOrders, setLoadingOrders, setLoadingMoreOrders} = orderSlice.actions

export const selectLoading = (state: any) => {
    return state?.order?.loadingOrders;
};

export const selectLoadingMore = (state: any) => {
    return state?.order?.loadingMore;
};

export const selectOrders = (state: any) => {
    return state?.order?.orders;
};

export default orderSlice.reducer

