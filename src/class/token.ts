import { ConstructorInterface, ITokenApp } from "../interface";
import { HttpRequest } from "./http-request";

export class TokenService {
    private readonly params: ConstructorInterface;
    private readonly ambientes = {
        hml: 'https://api-hml.pagsquare.com.br',
        prd: 'https://api.pagsquare.com.br'
    };
    private readonly hostname: string = '';
    private readonly httpRequest: HttpRequest;

    /** Cache do token (como veio da API, mas com expires_at garantido) */
    private tokenCache?: ITokenApp;

    /** Epoch ms em que o token expira (normalizado) */
    private tokenExpiresAtMs?: number;

    /** Promise em voo para evitar chamadas concorrentes gerarem múltiplos tokens */
    private refreshPromise?: Promise<ITokenApp>;

    private readonly ENDPOINT_GERAR_TOKEN_APP = "/v1/auth/oauth";

    /** Margem de segurança para considerar o token expirado (ex.: 60s antes) */
    private static readonly SKEW_MS = 60_000;

    /** TTL padrão se a API não retornar nem expires_at nem expires_in (evita cache infinito) */
    private static readonly DEFAULT_TTL_MS = 10 * 60_000; // 10 min

    constructor(params: ConstructorInterface) {
        this.params = params;
        this.hostname = params?.sandbox ? this.ambientes.hml : this.ambientes.prd;
        this.hostname = params?.host ?? this.hostname;
        this.httpRequest = new HttpRequest();
    }

    public async generate(): Promise<ITokenApp> {
        const cached = this.getTokenCache();
        if (cached) return cached;

        // De-duplica chamadas simultâneas
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.fetchNewToken();
        try {
            const token = await this.refreshPromise;
            return token;
        } finally {
            this.refreshPromise = undefined;
        }
    }

    private getTokenCache(): ITokenApp | undefined {
        if (!this.tokenCache?.access_token || !this.tokenExpiresAtMs) return undefined;

        const now = Date.now();
        if (now + TokenService.SKEW_MS >= this.tokenExpiresAtMs) {
            // expirado (ou prestes a expirar dentro da margem)
            return undefined;
        }
        return this.tokenCache;
    }

    private async fetchNewToken(): Promise<ITokenApp> {
        const axios = await this.getAxiosInstance();

        const ret = await this.httpRequest.post(axios, this.ENDPOINT_GERAR_TOKEN_APP, {
            clientId: this.params.clientId,
            clientSecret: this.params.clientSecret
        });

        // Alguns wrappers retornam { response: <data> }, então mantive sua estrutura
        const data = ret?.response ?? ret;

        // Normaliza expiração
        const expiresAtMs = this.computeExpiresAtMs(data);

        // Garante que o objeto em cache tenha um expires_at coerente (ISO)
        const normalized: ITokenApp = {
            ...data,
            // se sua interface não tiver expires_at, seguimos incluindo para uso interno
            expires_at: new Date(expiresAtMs).toISOString()
        };

        this.tokenCache = normalized;
        this.tokenExpiresAtMs = expiresAtMs;

        return normalized;
    }

    /** Aceita expires_at (Date | string | number) ou expires_in (segundos) */
    private computeExpiresAtMs(token: Partial<ITokenApp>): number {
        const now = Date.now();

        // 1) Tenta expires_at
        const fromAt = this.toEpochMs(token as any, 'expires_at');
        if (fromAt) return fromAt;

        // 2) Tenta expires_in (segundos)
        const expiresIn = (token as any)?.expires_in;
        if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
            return now + expiresIn * 1000;
        }

        // 3) Fallback: TTL padrão curto (evita cache eterno)
        return now + TokenService.DEFAULT_TTL_MS;
    }

    /** Converte campo para epoch ms, aceitando number, ISO string ou Date */
    private toEpochMs(obj: any, field: string): number | undefined {
        const v = obj?.[field];
        if (v == null) return undefined;

        if (typeof v === 'number') {
            // Heurística: se for em segundos, converte pra ms
            return v < 10_000_000_000 ? v * 1000 : v;
        }
        if (v instanceof Date) return v.getTime();

        if (typeof v === 'string') {
            // Tenta parse de ISO ou epoch em string
            const num = Number(v);
            if (!Number.isNaN(num)) {
                return num < 10_000_000_000 ? num * 1000 : num;
            }
            const t = Date.parse(v);
            if (!Number.isNaN(t)) return t;
        }
        return undefined;
    }

    private async getAxiosInstance() {
        return this.httpRequest.buildAxios({ url: this.hostname });
    }
}
