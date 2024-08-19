import { Router } from "express";
import { OrdersApi } from "../api/OrdersApi"
import { ordersRouter } from "./orders.router"
import { DataSource } from "typeorm"
import { IOrderQueueAdapterOUT } from "../../../core/messaging/IOrderQueueAdapterOUT"

export const router = (dataSource: DataSource, publisher: IOrderQueueAdapterOUT) => {
        
    const router = Router()

    const orderApi = new OrdersApi(dataSource, publisher)
    router.use('/production-orders', ordersRouter(orderApi))

    return router
}
