export interface IRequest {
    url: string;
    headers?: any;
    cert?: string;
    key?: string;
}

export interface IResponse {
    response?: any;
    error?: any;
}

export interface ITokenApp {
    expires_in?: number;
    expires_at?: Date;
    access_token?: string;
    scope?: string[];
    token_type?: `Bearer`
}