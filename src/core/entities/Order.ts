import { Product } from "./Product"

export class Order {
    id?: string;
    customerName: string;
    products: Product[];
    status: string    

    constructor(customerName: string, products: Product[]) {
        this.customerName = customerName;
        this.products = products;        
    }
}
