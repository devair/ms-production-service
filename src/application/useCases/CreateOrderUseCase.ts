import { DataSource } from "typeorm"
import { IOrderQueueAdapterOUT } from "../../core/messaging/IOrderQueueAdapterOUT"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OutputCreateOrderDTO } from "../dtos/ICreateOrderDTO"

class CreateOrderUseCase {
    
    constructor(
        private dataSource: DataSource
    ) {}
    
    async execute(order: any): Promise<OutputCreateOrderDTO> {


        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {            

            const orderCreated = await queryRunner.manager.getRepository(OrderSchema).save(order)

            const orderMessage = {
                id: orderCreated.id,
                status: orderCreated.status,
                amount: orderCreated.amount
            }
            
            await queryRunner.commitTransaction()    

            return orderMessage

        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        }
        finally{
            await queryRunner.release()
        }
    }
}

export { CreateOrderUseCase }