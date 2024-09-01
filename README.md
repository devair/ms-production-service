
# Micro serviço produção de pedidos  

Projeto desenvolvido para gerenciar a produção do sistema de pedidos de uma lanchonete utilizando os conceitos de Arquitetura Limpa (Clean Architecture)


## 1) Contexto da aplicação

Ao ocorrer o pagamento do pedido, este micro serviço irá enviar uma alteraçao de status do pedido no micro servico [ms-orders-service](https://github.com/devair/ms-orders-service)


## 2) Utilização da aplicação

### a) Atualização do status de um pedido

Utilizar a API abaixo para atualizar o status de um pedido.


PATCH http://localhost:3335/api/v1/production-orders/update/<PRODUCTION_ORDER_ID>

Content-Type: application/json

Body Request:
~~~json
{
   "status": <ORDER_STATUS>
}
~~~

Response Status Code: 201

Body Response:
~~~json
{
  "id": <PRODUCTION_ORDER>,
  "orderId": <ORDER_ID>,
  "status": <ORDER_STATUS>
}
~~~