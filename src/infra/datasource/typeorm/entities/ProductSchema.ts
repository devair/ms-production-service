import { ObjectId } from 'mongodb'
import { Column, ObjectIdColumn } from 'typeorm'
import { Product } from '../../../../core/entities/Product'


// Definindo o Schema do Product
export class ProductSchema {
    @ObjectIdColumn({ name: '_id'})
    _id: ObjectId

    @Column()
    productName: string;

    @Column()
    productCode: string;

    @Column()
    quantity: number;

    toDomain(): Product {
        let product = new Product(this.productName, this.productCode, this.quantity)
        if(this._id) product.id = this._id.toString()
        return product
    }

    static fromDomain(product: Product): ProductSchema {
        const productSchema = new ProductSchema()

        if (product.id) {
            productSchema._id = new ObjectId(product.id)
        }
        productSchema.quantity = product.quantity
        productSchema.productCode = product.productCode
        productSchema.productName = product.productName            
        
        return productSchema
    }
}
