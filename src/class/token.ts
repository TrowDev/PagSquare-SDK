import { ConstructorInterface, ITokenApp } from "../interface";
import { HttpRequest } from "./http-request";
import { getDateByTimeStamp, getTime } from "./utils/date.utils";

export class TokenService {
    private params: ConstructorInterface;
    private ambientes = {
        hml: 'https://api-hml.pagsquare.com.br',
        prd: 'https://api.pagsquare.com.br'
    };
    private hostname: string = '';
    private httpRequest: HttpRequest;
    private tokenCache: ITokenApp;

    constructor(params: ConstructorInterface) {
        this.params = params;
        this.hostname = this.ambientes.prd;
        if(params.sandbox) {
            this.hostname = this.ambientes.hml;
        }
        this.httpRequest = new HttpRequest();
        this.tokenCache = {  };
    }

    public async generate(): Promise<ITokenApp> {
        const tokenCache = await this.getTokenCache();
        if(tokenCache) return tokenCache;
        
        const axios = await this.getAxiosInstance();

        return await this.httpRequest.post(axios, "/v1/auth/oauth", {
            clientId: this.params.clientId,
            clientSecret: this.params.clientSecret
        }).then(ret => {
            this.tokenCache = ret.response;
            return ret.response as ITokenApp;
        });
    }

    private async getTokenCache(): Promise<ITokenApp | undefined> {
        if(!this.tokenCache || !this.tokenCache?.access_token || !this.tokenCache?.expires_at) return undefined;

        const agora = getDateByTimeStamp(getTime(), true);

        if (this?.tokenCache?.expires_at <= agora) {
            return undefined;
        }
        return this.tokenCache;
    }

    private async getAxiosInstance() {
        return await this.httpRequest.buildAxios({ url: this.hostname });
    }
}
