export interface Order {
    id: string
    orderId: string
    orderDate: string
    orderStatus: number
    paymentMethod: number
    shipmentCode: number
    postalCode: number
    trackerCode: number
    deliveryAmount: number
    discountAmount: number
    taxAmount: number
    orderItems: OrderItem[]
    page: number
    size: number
    variant1: string
    variant2: string
    variant3: string
}

export interface OrderItem {
    productId: number
    productName: string
    count: number
    price: number
    totalPrice: number
    variant1: string
    variant2: string
    variant3: string
}