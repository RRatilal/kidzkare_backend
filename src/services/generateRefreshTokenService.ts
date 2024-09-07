import { prismaClient } from "../prisma";

export async function generateRefreshToken(parentId: string) {
    const expiration = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

    const refreshToken = await prismaClient.token.create({
        data: {
            type: "API",
            expiration,
            parentId: parentId
        }
    })

    return refreshToken
}