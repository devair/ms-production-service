import { OutputFindOrderDTO } from "../../application/dtos/IFindOrderDTO"
import { ListOrdersUseCase } from "../../application/useCases/ListOrdersUseCase"

class ListOrdersController {

    constructor(private listOrdersUseCase: ListOrdersUseCase){}

    async handler(): Promise<OutputFindOrderDTO[]>{
        return await this.listOrdersUseCase.execute()
    }

}

export { ListOrdersController }