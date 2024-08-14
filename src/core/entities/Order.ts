import { Product } from "./Product"

export class Order {
    id?: string
    orderId: number
    customerName: string
    items: Product[]
    status: string    

    constructor(customerName: string) {
        this.customerName = customerName
        this.items = []     
    }
}

export enum OrderStatus {
    WAIT_PAYMENT = 'Aguardando pagamento',
    RECEIVED = 'Recebido',
    IN_PROGRESS = 'Em preparação',
    DONE = 'Pronto',
    CLOSED = 'Finalizado',
    REJECTED = 'Rejeitado'
}

