export class Product {
    id?: string;
    name: string;
    quantity: number;

    constructor(name: string, quantity: number) {
        this.name = name;
        this.quantity = quantity;
    }
}