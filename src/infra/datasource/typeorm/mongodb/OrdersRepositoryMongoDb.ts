import { Repository  } from "typeorm";
import { IOrdersGateway } from "../../../../communication/gateways/IOrdersGateway"
import { OrderSchema } from "../entities/OrderSchema"
import { Order } from "../../../../core/entities/Order"
import { ObjectId } from "mongodb"

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

    async findById(id: string): Promise<Order> {
        const order = await this.repository.findOne({ where: { _id: new ObjectId(id) }}) 
        if(order)
            return order.toDomain()
        return null
    }

    async findByOrderId(orderId: number): Promise<Order> {
        const order = await this.repository.findOne( { 
            where: {
                orderId
            }            
        })

        if(order) {
            return order.toDomain()
        }
        return null
    }

    updateStatus(order: Order): Promise<Order> {
        throw new Error("Method not implemented.")
    }
    
}

export { OrdersRepositoryMongoDb }