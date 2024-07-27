import axios, { AxiosInstance } from 'axios';
import { IRequest, IResponse } from '../interface';

export class HttpRequest {
    
    constructor() { }

    async buildAxios(requestData: IRequest): Promise<AxiosInstance> {
        const instance = axios.create({
            baseURL: requestData.url,
            httpsAgent: this.buildHttpAgent(requestData.cert, requestData.key),
            headers: requestData.headers
        });
        return instance;
    }

    private buildHttpAgent(certPath?: string, keyPath?: string, password?: string) {
        const fs = require('fs')
        const https = require('https')
        let cert, key, senha;
        if (certPath && keyPath) {
            cert = fs.readFileSync(certPath, 'utf-8');
            key = fs.readFileSync(keyPath, 'utf-8');
            senha = password;   
        }
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            cert: cert,
            key: key,
            passphrase: senha
        });
        return httpsAgent;
    }

    async post(axios: AxiosInstance, endpoint: string, data: any): Promise<IResponse> {
        return await axios.post(endpoint, data)
            .then(ret => {
                return {
                    response: ret.data
                }
            }).catch(err => {
                console.log('HttpService POST Error = ', this.trataRetornoErro(err));
                throw err;
            })
    }

    async put(axios: AxiosInstance, endpoint: string, data: any): Promise<IResponse> {
        return await axios.put(endpoint, data)
            .then(ret => {
                return {
                    response: ret.data
                }
            }).catch(err => {
                console.log('HttpService PUT Error = ', this.trataRetornoErro(err));
                throw err;
            })
    }

    async delete(axios: AxiosInstance, endpoint: string): Promise<IResponse> {
        return await axios.delete(endpoint)
            .then(ret => {
                return {
                    response: ret.data
                }
            }).catch(err => {
                console.log('HttpService DELETE Error = ', this.trataRetornoErro(err));
                throw err;
            })
    }

    async get(axios: AxiosInstance, endpoint: string): Promise<IResponse> {
        return await axios.get(endpoint)
            .then(ret => {
                return {
                    response: ret.data
                }
            }).catch(err => {
                console.log('HttpService GET Error = ', this.trataRetornoErro(err));
                throw err;
            })
    }

    trataRetornoErro(err: any) {
        if(err?.response) {
            let retorno = `[${err.response?.status}] ${err.response?.statusText}: `
            const data = err?.response?.data;
            if(data?.message) {
                retorno += `'${data.message}'`;
            } else if(data?.detail) {
                retorno += `'${data.detail}'`;
            } else {
                retorno = data;
            }
            return data;
        }
        return err?.code;
    }

}