import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import { generateAuthToken } from "../services/generateAuthTokenServices";
import { generateRefreshToken } from "../services/generateRefreshTokenService";

export default {
    async refreshToken(req: Request, res: Response) {
        const { refresh_token } = req.body;

        const refreshToken = await prismaClient.token.findFirst({
            where: {
                id: refresh_token
            }
        })

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token invalid" })
        }

        const authToken = generateAuthToken(refreshToken.parentId)

        if (refreshToken.expiration < new Date()) {
            await prismaClient.token.deleteMany({
                where: {
                    parentId: refreshToken.parentId
                }
            })

            const newRefreshToken = await generateRefreshToken(refreshToken.parentId)

            return res.json({ authToken, refreshToken: newRefreshToken })
        }

        return res.json({ authToken })
    }
}