import { Request, Response } from "express";
import { prismaClient } from "../prisma";

import { sendOtp } from "../services/otpServices";
import { generateAuthToken } from "../services/generateAuthTokenServices";
import { generateRefreshToken } from "../services/generateRefreshTokenService";

const numberTokenExpirationMinutes = 10;

function generateNumberToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

export default {
    async create(req: Request, res: Response) {
        const { number, dialCode, country } = req.body;

        console.log(req.body)

        // generate token
        const numberToken = generateNumberToken();

        const expiration = new Date(new Date().getTime() +  numberTokenExpirationMinutes * 60 * 1000);

        try {
            await prismaClient.token.create({
                data: {
                    type: "NUMBER",
                    numberToken,
                    expiration,
                    Parent: {
                        connectOrCreate: {
                            where: { number },
                            create: { number, dialCode, country }
                        }
                    }
                }
            });

            await sendOtp({ numberToken, number, dialCode });
    
            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Couldn't start the authentication process" });
        }
    },

    async auth(req: Request, res: Response) {
        const { number, numberToken } = req.body;
        
        const dbNumberToken = await prismaClient.token.findUnique({
            where: {
                numberToken
            },
            include: {
                Parent: true
            }
        });
        
        if (!dbNumberToken || !dbNumberToken.valid) {
            return res.sendStatus(401);
        }

        if (dbNumberToken.expiration < new Date()) {
            return res.status(401).json({ error: "Token expired!" });
        }

        if (dbNumberToken.Parent.number !== number) {
            return res.sendStatus(401);
        }

        // generate the authentication token
        const authToken = generateAuthToken(dbNumberToken.parentId)

        // generate the refresh token
        const refreshToken = await generateRefreshToken(dbNumberToken.parentId)

        // Invalidate the number token
        await prismaClient.token.update({
            where: { id: dbNumberToken.id },
            data: { valid: false }
        })

        res.json({ authToken, refreshToken });
    },

    async user(req: Request, res: Response) {
        const { userId } = req;
        console.log(userId)

        try {
            const user = await prismaClient.parent.findUnique({
                where: {
                    id: userId
                }
            })

            res.json({user})
        } catch (err) {
            
        }
    },

    async update(req: Request, res: Response) {
        const { userId } = req;
        const { name, email, avatarUrl } = req.body

        try {
            const user = await prismaClient.parent.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    email,
                }
            })

            res.json({user})
        } catch (err) {
            
        }
    },
}