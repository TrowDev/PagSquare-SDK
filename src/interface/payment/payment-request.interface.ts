export interface PaymentPixInConstructor {
    hostname: string;
}

export interface PaymentRequestInterface {
    /**
     * Referência (Externa ou Interna)
     */
    referencia: string;
    /**
     * URL para notificar aplicação de origem quando houver alteração de status.
     */
    callbackUrl: string;
    valor: number;
    valorPodeSerAlteradoPeloPagador?: boolean;
    expiresIn?: number;
    /**
     * O campo chave determina a chave Pix do recebedor que será utilizada para a cobrança
     */
    chave: string;
    /**
     * Cada respectiva informação adicional contida na lista (nome e valor) deve ser apresentada ao pagador.
     */
    infoAdicionais?: IPIXInfoAdicional[];
}

export interface IPagSquarePIXRequest {
    calendario: {
        /**
         * Tempo de vida da cobrança, especificado em segundos a partir da data de criação (Calendario.criacao)
         */
        expiracao: number;
    },
    valor: IPIXValor;
    /**
     * O campo chave determina a chave Pix do recebedor que será utilizada para a cobrança
     */
    chave: string;
    /**
     * O campo solicitacaoPagador determina um texto a ser apresentado ao pagador para 
     * que ele possa digitar uma informação correlata, em formato livre, a ser enviada ao recebedor. 
     * Esse texto está limitado a 140 caracteres.
     */
    solicitacaoPagador?: string;
    /**
     * Cada respectiva informação adicional contida na lista (nome e valor) deve ser apresentada ao pagador.
     */
    infoAdicionais?: IPIXInfoAdicional[];
    /**
     * Referência (Externa ou Interna)
     */
    referencia: string;
    /**
     * URL para notificar aplicação de origem quando houver alteração de status.
     */
    urlCallback: string;
}

export interface IPIXInfoAdicional {
    nome: string;
    valor: string;
}

export interface IPIXValor {
    /**
     * \d{1,10}\.\d{2} - Valor original da cobrança.
     */
    original: string;
    /**
     * Trata-se de um campo que determina se o valor final do documento pode ser alterado pelo pagador.
     * Na ausência desse campo, assume-se que não se pode alterar o valor do documento de cobrança, ou seja, 
     * assume-se o valor 0. Se o campo estiver presente e com valor 1, então está determinado que o valor final 
     * da cobrança pode ter seu valor alterado pelo pagador.
     */
    modalidadeAlteracao?: 0 | 1;
}
