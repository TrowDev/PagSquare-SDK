export interface StatusResponseInterface {
    referencia: string;
    uuid: string;
    observacao: string;
    pixCopiaCola: string;
    valor: number;
    taxa: number;
    id: number;
    status: 'CONCLUIDO' | 'APROVADO' | 'ANDAMENTO' | 'PENDENTE' | 'ESGOTADO' | 'ANALISE' | 'REJEITADO' | 'DEVOLVIDO';
    tipoOperacao: 'C' | 'D';
    tipoReferencia: 'INTERNO' | 'EXTERNO';
}