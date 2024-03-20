import { ConstructorInterface, ITokenApp } from "../interface";
import { HttpRequest } from "./http-request";

export class TokenService {
    private params: ConstructorInterface;
    private ambientes = {
        hml: 'https://api-hml.pagsquare.com.br',
        prd: 'https://api.pagsquare.com.br'
    };
    private hostname: string = '';
    private httpRequest: HttpRequest;

    constructor(params: ConstructorInterface) {
        this.params = params;
        this.hostname = this.ambientes.prd;
        if(params.sandbox) {
            this.hostname = this.ambientes.hml;
        }
        this.httpRequest = new HttpRequest();
    }

    public async generate(): Promise<ITokenApp> {
        const axios = await this.getAxiosInstance();

        return await this.httpRequest.post(axios, "/v1/auth/oauth", {
            clientId: this.params.clientId,
            clientSecret: this.params.clientSecret
        }).then(ret => ret.response as ITokenApp);
    }

    private async getAxiosInstance() {
        return await this.httpRequest.buildAxios({ url: this.hostname });
    }
}
