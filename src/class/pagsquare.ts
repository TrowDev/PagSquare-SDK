import { PaymentPixIn } from './payment.pix-in';
import { ConstructorInterface } from "../interface";
import { HttpRequest } from './http-request';
import { TokenService } from './token';
import { KeyPix } from './key.pix';

export class PagSquare {
    public paymentPixIn: PaymentPixIn;
    public keyPix: KeyPix;
    private httpRequest: HttpRequest;
    private tokenService: TokenService;
    private ambientes = {
        hml: 'https://api-hml.pagsquare.com.br',
        prd: 'https://api.pagsquare.com.br'
    };
    private hostname: string = '';

    constructor(params: ConstructorInterface) {
        this.hostname       = this.ambientes.prd;
        if(params.sandbox) {
            this.hostname   = this.ambientes.hml;
        }
        this.httpRequest    = new HttpRequest();
        this.tokenService   = new TokenService(params);
        this.paymentPixIn   = new PaymentPixIn({ hostname: this.hostname }, this.httpRequest, this.tokenService);
        this.keyPix         = new KeyPix({ hostname: this.hostname }, this.httpRequest, this.tokenService);
    }
}