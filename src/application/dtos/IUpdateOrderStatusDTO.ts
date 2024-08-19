interface InputUpdateOrderStatusDTO {
    id: string
    status: string
}

interface OutputUpdateOrderStatusDTO {
    id: string
    orderId: number
    status: string
}

export { InputUpdateOrderStatusDTO, OutputUpdateOrderStatusDTO }