import express from "express"
import "express-async-errors"
import * as dotenv from 'dotenv'
import { CreateOrderUseCase } from "../application/useCases/CreateOrderUseCase"
import { AppDataSource } from "../infra/datasource/typeorm"
import { OrderCreatedQueueAdapterIN } from "../infra/messaging/OrderCreatedQueueAdapterIN"
import { router } from "../interface/web/routers"
import RabbitMQOrderQueueAdapterOUT from "../infra/messaging/RabbitMQOrderQueueAdapterOUT"

dotenv.config()
const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : ''
const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3336

export const createApp = async () => {
    const app = express()
    app.disable("x-powered-by")
    app.use(express.json())

    //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.get('/health', (request, response) => {
        return response.status(200).send('Ok')
    })


    // Configura Persistencia
    if (process.env.NODE_ENV !== 'test') {
        AppDataSource.initialize().then(async (datasource) => {

            const createOrderUseCase = new CreateOrderUseCase(datasource)

            // Configura consumidor de ordem criada

            const orderCreatedConsumer = new OrderCreatedQueueAdapterIN(rabbitMqUrl, createOrderUseCase)
            await orderCreatedConsumer.consume()
            

            const orderQueueAdapterOut = new RabbitMQOrderQueueAdapterOUT()
            await orderQueueAdapterOut.connect()

            app.use('/api/v1', router(datasource, orderQueueAdapterOut))

            app.listen(port, () => {
                console.log(`Production service listening  on port ${port}`)
            })
        }).catch(error => console.log(error))
    }
    else {
        //app.use('/api/v1', router(AppDataSource, null))
    }

    return app
}