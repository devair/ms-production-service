import { DataSource } from "typeorm"
import { IOrdersGateway } from "../../communication/gateways/IOrdersGateway"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OrdersRepositoryMongoDb } from "../../infra/datasource/typeorm/mongodb/OrdersRepositoryMongoDb"
import { IOrderQueueAdapterOUT } from "../../core/messaging/IOrderQueueAdapterOUT"
import { Order, OrderStatus } from "../../core/entities/Order"
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
        
        if (!orderFound) {
            throw new Error(`production order ID ${id} does not exist`)
        }
        
        const orderStatus : OrderStatus | string = status   
        if (!((Object.values(OrderStatus) as string[]).includes(orderStatus))) {
            throw new Error(`Order Status ${status} does not exist`)
        }
        
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()    
        const ordersRepoUpdade = queryRunner.manager.getRepository(OrderSchema)
        
        try {    
            orderFound.status = orderStatus                            
            const orderUpdated = (await ordersRepoUpdade.save(OrderSchema.fromDomain(orderFound), { reload: true})).toDomain()

            const orderMessage = {
                id: orderUpdated.orderId,
                status: orderUpdated.status
            }

            await this.publisher.publish(QueueNames.ORDER_DONE,JSON.stringify(orderMessage))

            // Confirma a transação
            await queryRunner.commitTransaction()

            return { 
                id: orderUpdated.id,
                orderId: orderUpdated.orderId,
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