import { DataSource } from "typeorm"
import { Request, Response } from "express"
import { ListOrdersUseCase } from "../../../application/useCases/ListOrdersUseCase"
import { ListOrdersController } from "../../../communication/controllers/ListOrdersController"
import { OrderPresenter } from "../../../communication/presenters/OrderPresenter"
import { UpdateOrderStatusUseCase } from "../../../application/useCases/UpdateOrderStatusUseCase"
import { UpdateOrderStatusController } from "../../../communication/controllers/UpdateOrderStatusController"
import { IOrderQueueAdapterOUT } from "../../../core/messaging/IOrderQueueAdapterOUT"
import { FindByOrderIdCase } from "../../../application/useCases/FindByOrderIdCase"
import { FindByOrderIdController } from "../../../communication/controllers/FindByOrderIdController"

class OrdersApi {

    constructor(
        private readonly dataSource: DataSource,
        private publisher: IOrderQueueAdapterOUT
    ){}

    async list (request: Request, response: Response): Promise<Response> {
        const listOrdersUseCase = new ListOrdersUseCase(this.dataSource)
        const listOrdersController = new ListOrdersController(listOrdersUseCase)

        try {
            const data = await listOrdersController.handler()
            response.contentType('application/json')
            return response.status(200).send(OrderPresenter.toJson(data))
        } catch (ex) {
            return response.status(400).json({ message: ex.message })
        } 

    }

    async updateStatus(request: Request, response: Response): Promise<Response> {

        let { id } = request.params
        let { status } = request.body
        
        const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(this.dataSource, this.publisher)       
        const updateStatusOrderController = new UpdateOrderStatusController(updateOrderStatusUseCase)

        try {
            const data = await updateStatusOrderController.handler({ id, status })
            response.contentType('application/json')
            return response.status(200).send(OrderPresenter.toJson(data))
        }
        catch (ex) {
            return response.status(400).json({ message: ex.message })
        }
    }

    async findByOrderId(request: Request, response: Response): Promise<Response> {
        const { id } = request.params
        const findByOrderIdCase = new FindByOrderIdCase(this.dataSource)
        const findByOrderIdController = new FindByOrderIdController(findByOrderIdCase)        

        try{
            const data = await findByOrderIdController.handler(parseInt(id))
            response.contentType('application/json')
            return response.status(200).send(OrderPresenter.toJson(data))
        } catch (ex) {
            return response.status(400).json({ message: ex.message });
        }        
    }
}

export { OrdersApi }