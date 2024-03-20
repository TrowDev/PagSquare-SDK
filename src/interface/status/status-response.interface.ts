export interface StatusResponseInterface {
    referencia: string;
    uuid: string;
    observacao: string;
    pixCopiaCola: string;
    valor: number;
    taxa: number;
    status: 'CONCLUIDO' | 'APROVADO' | 'ANDAMENTO' | 'PENDENTE' | 'ESGOTADO' | 'ANALISE' | 'REJEITADO';
    tipoOperacao: 'C' | 'D';
    tipoReferencia: 'INTERNO' | 'EXTERNO';
}