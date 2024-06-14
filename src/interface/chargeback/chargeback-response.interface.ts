export interface DevolucaoResponse {
    id: number;
    uuid: string;
    /**
     * Valor único identificador de uma TRANSAÇÃO de DEVOLUÇÃO
     */
    endToEnd: string;
    uuidPixOut: string;
    status: StatusDevolucao;
    retentativas: number;
    dtInclusao?: Date;
    dtAtualizacao?: Date;
}

export enum StatusDevolucao {
    CONCLUIDO,
    PENDENTE,
    ANDAMENTO,
    REJEITADO
}