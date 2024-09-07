import { sign } from "jsonwebtoken";

export function generateAuthToken(tokenId: string): string {
    const jwtPayload = { tokenId };

    return sign(jwtPayload, process.env.JWT_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1h"
    })
}