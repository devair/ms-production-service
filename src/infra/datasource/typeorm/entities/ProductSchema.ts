import { ObjectId } from 'mongodb'
import { Column, ObjectIdColumn } from 'typeorm'


// Definindo o Schema do Product
export class ProductSchema {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    name: string;

    @Column()
    quantity: number;
}
