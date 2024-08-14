import { Repository  } from "typeorm";
import { IOrdersGateway } from "../../../../communication/gateways/IOrdersGateway"
import { OrderSchema } from "../entities/OrderSchema"
import { Order } from "../../../../core/entities/Order"

class OrdersRepositoryMongoDb implements IOrdersGateway{
    
    constructor(
        private readonly repository: Repository<OrderSchema>
    ){}

    async create(order: Order): Promise<Order> {
        const orderCreated = await this.repository.save(order)
        return orderCreated
    }

    async list(): Promise<Order[]>  {
        const all = await this.repository.find()     

        let orders: Order[] = []
        all.forEach((elem)=>{
            orders.push(elem.toDomain())            
        })
        return orders
    }

    findById(id: string): Promise<Order> {
        throw new Error("Method not implemented.")
    }
    updateStatus(order: Order): Promise<Order> {
        throw new Error("Method not implemented.")
    }
    
}

export { OrdersRepositoryMongoDb }