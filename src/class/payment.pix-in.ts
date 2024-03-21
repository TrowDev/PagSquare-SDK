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

    private async getAxiosInstance() {
        return await this.httpRequest.buildAxios({ url: this.params.hostname });
    }

    public async request(request: PaymentRequestInterface, tokenApp?: string): Promise<PaymentResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance();
        const body: IPagSquarePIXRequest = {
            calendario: {
                expiracao: 7200,
            },
            valor: {
                original: `${request.valor}`,
                modalidadeAlteracao: 1
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
        const QRCode = require('qrcode');
        const imagem = await QRCode.toDataURL(data.qrcode.base64);

        data.qrcode.image = imagem;
        return data;
    }

    public async status(params: StatusRequestInterface, tokenApp?: string): Promise<StatusResponseInterface> {
        if(!tokenApp) {
            const tokenAuth = await this.tokenService.generate();
            tokenApp = tokenAuth.access_token;
        }
        const axios = await this.getAxiosInstance();
        let valorBuscar = params.referenceId;
        let tipoBusca   = 'referencia';
        if(params.uuid) {
            valorBuscar = params.uuid;
            tipoBusca   = 'uuid';
        }

        return await this.httpRequest.get(axios, `/v1/pix-in/status/${valorBuscar}?campo=${tipoBusca}`)
            .then(ret => ret.response as StatusResponseInterface);
    }
}
