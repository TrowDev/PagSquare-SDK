import { ITransactionResponse, PaymentTransactionConstructor } from '../interface/transaction';
import { HttpRequest } from "./http-request";
import { TokenService } from "./token";

export class PaymentTransaction {
    private readonly params: PaymentTransactionConstructor;
    private readonly httpRequest: HttpRequest;
    private readonly tokenService: TokenService;
    private readonly ENDPOINT_CONSULTAR_PEDIDO_MOVIMENTACAO = "/v1/movimentacao/pedido/";

    constructor(params: PaymentTransactionConstructor, httpRequest: HttpRequest, tokenService: TokenService) {
        this.params = params;
        this.httpRequest = httpRequest;
        this.tokenService = tokenService;
    }

    private async getAxiosInstance(tokenApp: string | undefined) {
        return await this.httpRequest.buildAxios({ url: this.params.hostname, headers: {
            Authorization: `Bearer ${tokenApp}`
        } });
    }

    public async requestByPedidoId(pedidoId: number, tokenApp?: string): Promise<ITransactionResponse> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.get(axios, `${this.ENDPOINT_CONSULTAR_PEDIDO_MOVIMENTACAO}${pedidoId}`)
            .then(ret => ret.response as ITransactionResponse);
    }
}
