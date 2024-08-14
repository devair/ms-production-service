import { DataSource } from "typeorm"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { IOrdersGateway } from "../../communication/gateways/IOrdersGateway"
import { OrdersRepositoryMongoDb } from "../../infra/datasource/typeorm/mongodb/OrdersRepositoryMongoDb"
import { OutputFindOrderDTO } from "../dtos/IFindOrderDTO"

class ListOrdersUseCase {
    
    private ordersRepository: IOrdersGateway

    constructor(
        private dataSource: DataSource        
    ) {
        this.ordersRepository = new OrdersRepositoryMongoDb(this.dataSource.getRepository(OrderSchema))        
    }

    async execute(): Promise<OutputFindOrderDTO[]> { 
                
        const orders = await this.ordersRepository.list()

        const output = orders.map((elem) => ({
            id: elem.id.toString(),
            customerName: elem.customerName,
            items: elem.items,
            orderId: elem.orderId,
            status: elem.status
        }))

        return output
    }
}

export { ListOrdersUseCase }