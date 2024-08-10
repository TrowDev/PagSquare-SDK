import qrcode from 'qrcode';
import {
    IPagSquarePIXRequest,
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

    private async getAxiosInstance(tokenApp: string | undefined) {
        return await this.httpRequest.buildAxios({ url: this.params.hostname, headers: {
            Authorization: `Bearer ${tokenApp}`
        } });
    }

    public async request(request: PaymentRequestInterface, tokenApp?: string): Promise<PaymentResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);
        const body: IPagSquarePIXRequest = {
            calendario: {
                expiracao: 7200,
            },
            valor: {
                original: `${request.valor}`,
                modalidadeAlteracao: request.valorPodeSerAlteradoPeloPagador ? 1 : 0,
            },
            chave: request.chave,
            referencia: request.referencia,
            urlCallback: request.callbackUrl,
            infoAdicionais: request.infoAdicionais,
        }

        return await this.httpRequest.post(axios, "/v1/pix-in/receber", body)
            .then(async (ret) => await this.generateQrcodeImage(ret.response));
    }

    private async generateQrcodeImage(data: PaymentResponseInterface) {
        const imagem = await qrcode.toDataURL(data.qrcode.content);

        data.qrcode.image = imagem;
        return data;
    }

    public async status(params: StatusRequestInterface, tokenApp?: string): Promise<StatusResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance(tokenApp);
        let valorBuscar = params.referenceId;
        let tipoBusca   = 'referencia';
        if(params.uuid) {
            valorBuscar = params.uuid;
            tipoBusca   = 'uuid';
        }

        return await this.httpRequest.get(axios, `/v1/pedidos/${valorBuscar}?campo=${tipoBusca}`)
            .then(ret => ret.response as StatusResponseInterface);
    }
}
