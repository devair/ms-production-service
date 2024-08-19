import { ObjectId } from "mongodb"
import { Entity, ObjectIdColumn, Column } from "typeorm"
import { ProductSchema } from "./ProductSchema"
import { Order } from "../../../../core/entities/Order"

@Entity({ name: "order" })
export class OrderSchema {
    @ObjectIdColumn({ name: '_id'})
    _id: ObjectId

    @Column({ nullable : false, unique: true})
    orderId: number

    @Column()
    customerName: string

    @Column()
    status: string

    @Column(type => ProductSchema)
    items: ProductSchema[]

    toDomain(): Order {
        let order = new Order(this.customerName)
        order.id = this._id.toString()
        order.status = this.status
        order.items = this.items.map((elem) => elem.toDomain())
        order.customerName = this.customerName
        order.orderId = this.orderId
        return order
    }

    static fromDomain(order: Order): OrderSchema {
        const orderSchema = new OrderSchema()

        if (order.id) {
            orderSchema._id = new ObjectId(order.id)
        }   
        orderSchema.customerName = order.customerName
        orderSchema.orderId = order.orderId      
        orderSchema.status = order.status
        orderSchema.items = order.items.map(ele => ProductSchema.fromDomain(ele))
        
        return orderSchema
    }
}