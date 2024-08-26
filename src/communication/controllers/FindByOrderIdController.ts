import { OutputFindOrderDTO } from "../../application/dtos/IFindOrderDTO"
import { FindByOrderIdCase } from "../../application/useCases/FindByOrderIdCase"

class FindByOrderIdController {

    constructor(private findByOrderIdCase: FindByOrderIdCase){}

    async handler(orderId: number): Promise<OutputFindOrderDTO>{
        return await this.findByOrderIdCase.execute(orderId)
    }
}

export { FindByOrderIdController }