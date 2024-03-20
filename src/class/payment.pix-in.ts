import {
    PaymentPixInConstructor,
    PaymentRequestInterface,
    PaymentResponseInterface,
    StatusRequestInterface,
    StatusResponseInterface
} from "../interface";
import { HttpRequest } from "./http-request";
import { TokenService } from "./token";

export class PaymentPixIn {
    private params: PaymentPixInConstructor;
    private httpRequest: HttpRequest;
    private tokenService: TokenService;

    constructor(params: PaymentPixInConstructor, httpRequest: HttpRequest, tokenService: TokenService) {
        this.params = params;
        this.httpRequest = httpRequest;
        this.tokenService = tokenService;
    }

    private async getAxiosInstance() {
        return await this.httpRequest.buildAxios({ url: this.params.hostname });
    }

    public async request(request: PaymentRequestInterface, tokenApp?: string): Promise<PaymentResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance();

        return await this.httpRequest.post(axios, "/v1/pix-in/receber", request)
            .then(ret => ret.response as PaymentResponseInterface);
    }

    public async status(params: StatusRequestInterface, tokenApp?: string): Promise<StatusResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance();

        return await this.httpRequest.get(axios, `/v1/pix-in/status/${params.referenceId}`)
            .then(ret => ret.response as StatusResponseInterface);
    }
}
