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
    tipo: 'EMAIL' | 'DOCUMENTO';
    /**
     * UUID gerado pela PagSquare quando a conta foi criada.
     */
    uuid: string;
}

export interface KeyPixConstructor {
    hostname: string;
}
