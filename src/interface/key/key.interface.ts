export interface KeyPixRequest {
    /**
     * Chave PIX
     */
    chave: string;
    /**
     * ID do usuário no sistema parceiro
     */
    referencia: number;
    /**
     * Nome do parceiro que iniciou a solicitação;
     */
    tpSolicitacao: 'LOJASQUARE';
}

export interface KeyPixConstructor {
    hostname: string;
}
