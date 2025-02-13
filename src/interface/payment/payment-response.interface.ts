export interface Qrcode {
    content: string;
    base64: string;
    image: string;
}

export interface PaymentResponseInterface {
    referenceId: string;
    uuid: string;
    expiresAt: Date;
    qrcode: Qrcode;
}
