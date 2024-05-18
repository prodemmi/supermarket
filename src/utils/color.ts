const _map = [
    "danger",
    "warning",
    "info",
    "warning",
];

export const getOrderStatusColor = (status: number): string => _map[status] as string