import { Router } from "express"
import { OrdersApi } from "../api/OrdersApi"


export const ordersRouter = (api: OrdersApi) => {
    const router = Router()

    router.patch('/update/:id', (req, res) => api.updateStatus(req, res))
    //router.get('/:id', (req, res) => api.list(req, res))
    router.get('/', (req, res) => api.list(req, res))

    return router
}