export class Product {
    id?: string
    productName: string
    productCode: string
    quantity: number;

    constructor(productName: string, productCode: string, quantity: number) {
        this.productName = productName;
        this.productCode = productCode;
        this.quantity = quantity;
    }
}