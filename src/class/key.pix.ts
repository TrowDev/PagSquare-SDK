import { KeyPixConstructor, KeyPixRequest, RemoveKeyPixRequest, TipoChave } from '../interface/key';
import { HttpRequest } from "./http-request";
import { TokenService } from "./token";
import { validaDadosChavePIX } from "./utils/validacoes.util";

export class KeyPix {
    private readonly params: KeyPixConstructor;
    private readonly httpRequest: HttpRequest;
    private readonly tokenService: TokenService;
    private readonly ENDPOINT_CRIAR_ATUALIZAR_CONTA = "/v1/conta";

    constructor(params: KeyPixConstructor, httpRequest: HttpRequest, tokenService: TokenService) {
        this.params = params;
        this.httpRequest = httpRequest;
        this.tokenService = tokenService;
    }

    private async getAxiosInstance(tokenApp: string | undefined) {
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

        return await this.httpRequest.post(axios, this.ENDPOINT_CRIAR_ATUALIZAR_CONTA, request);
    }

    public async update(request: KeyPixRequest, tokenApp?: string): Promise<any> {
        this.validateKeyPatterns(request.chave, request.tipo);
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.put(axios, this.ENDPOINT_CRIAR_ATUALIZAR_CONTA, request);
    }

    public async delete(request: RemoveKeyPixRequest, tokenApp?: string): Promise<any> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);

        return await this.httpRequest.delete(axios, `/v1/conta/${request.uuid}`);
    }

    private validateKeyPatterns(chave: string, tipo: TipoChave) {
        if(!validaDadosChavePIX(chave, tipo)) {
            throw new Error(`A chave '${chave}' está fora do padrão.`);
        }
    }
}
