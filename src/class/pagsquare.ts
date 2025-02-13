import { ConstructorInterface } from "../interface";
import { Chargeback } from './chargeback';
import { HttpRequest } from './http-request';
import { KeyPix } from './key.pix';
import { PaymentPixIn } from './payment.pix-in';
import { TokenService } from './token';
import { PaymentTransaction } from './transaction';

export class PagSquare {
    public paymentPixIn: PaymentPixIn;
    public keyPix: KeyPix;
    public transaction: PaymentTransaction;
    public chargeback: Chargeback;
    public tokenService: TokenService;
    private readonly httpRequest: HttpRequest;
    private readonly ambientes = {
        hml: 'https://api-hml.pagsquare.com.br',
        prd: 'https://api.pagsquare.com.br'
    };
    private readonly hostname: string = '';

    constructor(params: ConstructorInterface) {
        this.hostname       = this.ambientes.prd;
        if(params.sandbox) {
            this.hostname   = this.ambientes.hml;
        }
        this.httpRequest    = new HttpRequest();
        this.tokenService   = new TokenService(params);
        this.paymentPixIn   = new PaymentPixIn({ hostname: this.hostname }, this.httpRequest, this.tokenService);
        this.transaction    = new PaymentTransaction({ hostname: this.hostname }, this.httpRequest, this.tokenService);
        this.chargeback     = new Chargeback({ hostname: this.hostname }, this.httpRequest, this.tokenService);
        this.keyPix         = new KeyPix({ hostname: this.hostname }, this.httpRequest, this.tokenService);
    }
}