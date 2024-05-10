import { HttpRequest } from "./http-request";
import { TokenService } from "./token";
import { KeyPixConstructor, KeyPixRequest } from '../interface/key';
import { validaDadosChavePIX } from "./validacoes.util";

export class KeyPix {
    private params: KeyPixConstructor;
    private httpRequest: HttpRequest;
    private tokenService: TokenService;

    constructor(params: KeyPixConstructor, httpRequest: HttpRequest, tokenService: TokenService) {
        this.params = params;
        this.httpRequest = httpRequest;
        this.tokenService = tokenService;
    }

    private async getAxiosInstance(tokenApp: string) {
        return await this.httpRequest.buildAxios({ url: this.params.hostname, headers: {
            Authorization: `Bearer ${tokenApp}`
        } });
    }

    public async request(request: KeyPixRequest, tokenApp?: string): Promise<any> {
        this.validateKeyPatterns(request.chave, request.tipo);
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.post(axios, "/v1/conta", request);
    }

    public async update(request: KeyPixRequest, tokenApp?: string): Promise<any> {
        this.validateKeyPatterns(request.chave, request.tipo);
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.put(axios, "/v1/conta", request);
    }

    private validateKeyPatterns(chave: string, tipo: 'EMAIL' | 'DOCUMENTO') {
        if(!validaDadosChavePIX(chave, tipo)) {
            throw new Error(`A chave '${chave}' está fora do padrão.`);
        }
    }
}
