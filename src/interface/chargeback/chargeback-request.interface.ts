export interface ChargebackConstructor {
    hostname: string;
}

export interface PaymentChargeback {
    uuidContaPix: string;
    uuidPedidoPixIn: string;
    endToEndEstorno: string;
}