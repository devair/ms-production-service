import { ObjectId } from "mongodb"
import { Entity, ObjectIdColumn, Column } from "typeorm"
import { ProductSchema } from "./ProductSchema"

@Entity({ name: "order"})
export class OrderSchema {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    customerName: string;

    @Column(type => ProductSchema)
    products: ProductSchema[];
}