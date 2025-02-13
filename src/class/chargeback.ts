import { ChargebackConstructor, DevolucaoResponse, PaymentChargeback } from "../interface/chargeback";
import { HttpRequest } from "./http-request";
import { TokenService } from "./token";

export class Chargeback {
    private readonly params: ChargebackConstructor;
    private readonly httpRequest: HttpRequest;
    private readonly tokenService: TokenService;
    private readonly ENDPOINT_DEVOLVER_PIX = "/v1/devolucao";

    constructor(params: ChargebackConstructor, httpRequest: HttpRequest, tokenService: TokenService) {
        this.params = params;
        this.httpRequest = httpRequest;
        this.tokenService = tokenService;
    }

    private async getAxiosInstance(tokenApp: string | undefined) {
        return await this.httpRequest.buildAxios({ url: this.params.hostname, headers: {
            Authorization: `Bearer ${tokenApp}`
        } });
    }

    public async requestDevolucao(chargeback: PaymentChargeback, tokenApp?: string): Promise<DevolucaoResponse> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.post(axios, this.ENDPOINT_DEVOLVER_PIX, chargeback)
            .then(ret => ret.response as DevolucaoResponse);
    }
}
