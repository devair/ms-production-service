import { DataSource } from "typeorm"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OutputCreateOrderDTO } from "../dtos/ICreateOrderDTO"
import { Order, OrderStatus } from "../../core/entities/Order"
import { IOrdersGateway } from "../../communication/gateways/IOrdersGateway"
import { OrdersRepositoryMongoDb } from "../../infra/datasource/typeorm/mongodb/OrdersRepositoryMongoDb"

class CreateOrderUseCase {
    
    private ordersRepository: IOrdersGateway

    constructor(
        private dataSource: DataSource
    ) {
        this.ordersRepository = this.ordersRepository = new OrdersRepositoryMongoDb(this.dataSource.getRepository(OrderSchema))
    }
    
    async execute(order: Order): Promise<OutputCreateOrderDTO> {


        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {            

            const orderFound = await this.ordersRepository.findByOrderId(order.orderId)
            if(orderFound) throw new Error(`Production Order id ${order.id} already exists`)

            const orderCreated = await queryRunner.manager.getRepository(OrderSchema).save(OrderSchema.fromDomain(order))

            const orderToDomain = orderCreated.toDomain()

            const orderMessage :OutputCreateOrderDTO = { 
                id: orderToDomain.id,
                status: orderToDomain.status                
            }
            
            await queryRunner.commitTransaction()    

            return orderMessage

        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error)
            throw error
        }
        finally{
            await queryRunner.release()
        }
    }
}

export { CreateOrderUseCase }