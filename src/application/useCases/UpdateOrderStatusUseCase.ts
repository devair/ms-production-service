import { DataSource } from "typeorm"
import { IOrdersGateway } from "../../communication/gateways/IOrdersGateway"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OrdersRepositoryMongoDb } from "../../infra/datasource/typeorm/mongodb/OrdersRepositoryMongoDb"
import { IOrderQueueAdapterOUT } from "../../core/messaging/IOrderQueueAdapterOUT"
import { OrderStatus } from "../../core/entities/Order"
import { InputUpdateOrderStatusDTO, OutputUpdateOrderStatusDTO } from "../dtos/IUpdateOrderStatusDTO"
import { QueueNames } from "../../core/messaging/QueueNames"


class UpdateOrderStatusUseCase{
    
    private ordersRepository: IOrdersGateway
    
    constructor(
        private dataSource: DataSource,
        private publisher: IOrderQueueAdapterOUT        
    ) {
        this.ordersRepository = new OrdersRepositoryMongoDb(this.dataSource.getRepository(OrderSchema))           
    }
    
    async execute({ id, status }: InputUpdateOrderStatusDTO ): Promise<OutputUpdateOrderStatusDTO> {

        const orderFound = await this.ordersRepository.findById(id)
        let orderUpdate = orderFound
        const orderStatus : OrderStatus | string = status   

        if (!((Object.values(OrderStatus) as string[]).includes(orderStatus))) {
            throw new Error(`Order Status ${status} does not exist`)
        }

        Object.assign(orderUpdate, {
            id: id,
            status: orderStatus
        })

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {            
            const orderUpdated = await this.ordersRepository.updateStatus(orderUpdate)

            await this.publisher.publish(QueueNames.ORDER_DONE,JSON.stringify(orderUpdated))
           
            return { 
                id: orderUpdated.id,
                status: orderUpdated.status
            }

        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        }
        finally{
            await queryRunner.release()
        }
            
    }
}

export { UpdateOrderStatusUseCase }