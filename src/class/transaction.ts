import { HttpRequest } from "./http-request";
import { TokenService } from "./token";
import { ITransactionResponse, PaymentTransactionConstructor } from '../interface/transaction';

export class PaymentTransaction {
    private params: PaymentTransactionConstructor;
    private httpRequest: HttpRequest;
    private tokenService: TokenService;

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

        return await this.httpRequest.get(axios, `/v1/movimentacao/pedido/${pedidoId}`)
            .then(ret => ret.response as ITransactionResponse);
    }
}
