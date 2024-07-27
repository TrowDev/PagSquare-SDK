export interface KeyPixRequest {
    /**
     * Chave PIX
     */
    chave: string;
    /**
     * E-mail da conta no sistema parceiro.
     */
    email: string;
    /**
     * ID do usuário no sistema parceiro
     */
    referencia: number;
    /**
     * Nome do parceiro que iniciou a solicitação;
     */
    tpSolicitacao: string;
    tipo: TipoChave;
    /**
     * UUID gerado pela PagSquare quando a conta foi criada.
     */
    uuid: string;
}

export enum TipoChave {
    EMAIL = "EMAIL",
    DOCUMENTO = "DOCUMENTO"
}

export interface KeyPixConstructor {
    hostname: string;
}
