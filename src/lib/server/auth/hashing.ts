import crypto from "crypto";

const keyLength = 32;

export function hash(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    return `${crypto.scryptSync(password, salt, keyLength).toString("hex")}${salt}`;
}

export function matches(password: string, hashedPassword: string) {
    const [key, salt] = [hashedPassword.slice(0, keyLength * 2), hashedPassword.slice(keyLength * 2)];
    return key === crypto.scryptSync(password, salt, keyLength).toString("hex");
}
