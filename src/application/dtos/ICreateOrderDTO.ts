import { InputCreateOrderItemDTO } from "../dtos/ICreateOrderItemDTO"

interface InputCreateOrderDTO {
    customer: { cpf: string }
    orderItems: InputCreateOrderItemDTO[]
}

interface OutputCreateOrderDTO {
    id: number
    status: string
    amount: number
}

export { InputCreateOrderDTO, OutputCreateOrderDTO }