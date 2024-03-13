import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import jwt from "jsonwebtoken";
import { sendSmsToken } from "../services/smsServices";

const numberTokenExpirationMinutes = 10;
const authTokenExpirationHours = 240;

function generateNumberToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

function generateAuthToken(tokenId: string): string {
    const jwtPayload = { tokenId };

    return jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        algorithm: "HS256",
        noTimestamp: true
    })
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

            sendSmsToken({numberToken})
    
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

        const expiration = new Date(new Date().getTime() +  authTokenExpirationHours * 60 * 60 * 1000);

        const apiToken = await prismaClient.token.create({
            data: {
                type: "API",
                expiration,
                Parent: {
                    connect: { number }
                }
            }
        })

        // Invalidate the email
        await prismaClient.token.update({
            where: { id: dbNumberToken.id },
            data: { valid: false }
        })

        // generate the JWT token
        const authToken = generateAuthToken(apiToken.id)

        // const userId = apiToken.userId;

        res.json({ authToken });
    },

    async user(req: Request, res: Response) {
        const { userId } = req;

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