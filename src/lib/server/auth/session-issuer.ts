import { sign, verify, type JwtPayload } from "jsonwebtoken";

interface Session {
    issued: Date;
    expires?: Date;
}

export default class SessionIssuer<T extends Session> {
    
    constructor(private privateKey: string) { }

    encode(data: Omit<T, keyof Session>, expiresIn?: string | number): string {
        return sign(data, this.privateKey, expiresIn != null ? { expiresIn } : undefined);
    }

    decode(token: string): T | null {
        try {
            const { iat, exp, ...rest } = verify(token, this.privateKey) as JwtPayload;
            return {
                issued: new Date(iat! * 1000),
                expires: exp != null ? new Date(exp * 1000) : undefined,
                ...rest
            } as T;
        }
        catch (e) {
            return null;
        }
    }
}
