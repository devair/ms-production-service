import amqpCallback from "amqplib/callback_api"

import { CreateOrderUseCase } from "../../application/useCases/CreateOrderUseCase"
import { QueueNames } from "../../core/messaging/QueueNames"

export class OrderCreatedQueueAdapterIN {
    constructor(
        private rabbitMQUrl: string,
        private createOrderUseCase: CreateOrderUseCase
    ) { }

    async consume() {
        amqpCallback.connect(this.rabbitMQUrl, (err: any, connection: any) => {
            if (err) {
                throw err;
            }
            connection.createChannel((err: any, channel: any) => {
                if (err) {
                    throw err;
                }
                channel.assertQueue(QueueNames.ORDER_TO_PRODUCE, { durable: true });
                channel.consume(QueueNames.ORDER_TO_PRODUCE, async (msg: any) => {
                    if (msg !== null) {
                        try {
                            // Processa a mensagem                            
                            const order = JSON.parse(msg.content.toString());
                            console.log('Production - Received:', order)

                            // Aqui o servico persiste e publica na mesma transacao para o proximo canal
                            await this.createOrderUseCase.execute(order)
                            channel.ack(msg);
                        } catch (error) {
                            console.error('Processing error');
                            // Rejeita a mensagem e reencaminha para a fila
                            channel.nack(msg);
                        }
                    }
                }, { noAck: false })
            })
        })
    }

}