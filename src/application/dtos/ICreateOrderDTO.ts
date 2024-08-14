import { InputCreateOrderItemDTO } from "../dtos/ICreateOrderItemDTO"

interface InputCreateOrderDTO {
    customer: { cpf: string }
    orderItems: InputCreateOrderItemDTO[]
}

interface OutputCreateOrderDTO {
    id: string
    status: string    
}

export { InputCreateOrderDTO, OutputCreateOrderDTO }