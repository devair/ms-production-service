import { Order } from "../../core/entities/Order"

interface IOrdersGateway {

    create( order: Order ): Promise<Order>

    list(): Promise<Order[]>
        
    findById(id: string): Promise<Order>

    updateStatus(order: Order ): Promise<Order>

    findByOrderId(orderId: number): Promise<Order>
}

export { IOrdersGateway }