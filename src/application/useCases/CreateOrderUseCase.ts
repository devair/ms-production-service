import { DataSource } from "typeorm"
import { OrderSchema } from "../../infra/datasource/typeorm/entities/OrderSchema"
import { OutputCreateOrderDTO } from "../dtos/ICreateOrderDTO"
import { Order } from "../../core/entities/Order"

class CreateOrderUseCase {
    
    constructor(
        private dataSource: DataSource
    ) {}
    
    async execute(order: Order): Promise<OutputCreateOrderDTO> {


        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.startTransaction()

        try {            

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
            throw error
        }
        finally{
            await queryRunner.release()
        }
    }
}

export { CreateOrderUseCase }