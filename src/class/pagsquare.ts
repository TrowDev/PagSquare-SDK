import { PaymentPixIn } from './payment.pix-in';
import { ConstructorInterface } from "../interface";
import { HttpRequest } from './http-request';
import { TokenService } from './token';

export class PagSquare {
    public paymentPixIn: PaymentPixIn;
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
    }
}