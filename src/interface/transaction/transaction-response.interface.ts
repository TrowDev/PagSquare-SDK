export interface ITransactionResponse {
    id: number;
    pedidoId: number;
    dtInclusao: Date;
    dtAtualizacao: Date;
    contaFavorecidoFinalId: number;
    uuid: string;
    endToEnd: string;
    endToEndPai: string;
    idIdempotente: string;
    txId: string;
    valor: number;
    statusMovimentacao: string;
    tpSolicitacao: string;
    tpTransacao: string;
    flDevolvido: 'S' | 'N';
    tpOperacao: 'C' | 'D';
    nomePagador: string;
    documentoPagador: string;
    nomeEmpresaPagador: string;
    nomeRecebedor: string;
    documentoRecebedor: string;
    nomeEmpresaRecebedor: string;
    chavePixRecebedor: string;
    origemMovimentacao: string;
    dtEfetivacao: Date;
    dtConciliacao: Date;
}