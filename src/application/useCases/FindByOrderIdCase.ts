import { DataSource } from "typeorm"
import { IOrdersGateway } from "../../communication/gateways/IOrdersGateway"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OrdersRepositoryMongoDb } from "../../infra/datasource/typeorm/mongodb/OrdersRepositoryMongoDb"
import { OutputFindOrderDTO } from "../dtos/IFindOrderDTO"

class FindByOrderIdCase {

    private ordersRepository: IOrdersGateway

    constructor(
        private dataSource: DataSource        
    ){
        this.ordersRepository = new OrdersRepositoryMongoDb(this.dataSource.getRepository(OrderSchema))
    }
    async execute(orderId: number): Promise<OutputFindOrderDTO> {
        const order = await this.ordersRepository.findByOrderId(orderId)

        const output = {
            id: order.id,
            customerName: order.customerName,
            orderId: order.orderId,
            status: order.status
        }

        return output
    }
}

export { FindByOrderIdCase }