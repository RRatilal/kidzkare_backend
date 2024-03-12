import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../prisma";

interface IPayload {
    tokenId: string;
}

export async function ensureAutheticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({
            errorCode: "Token invalid"
        })
    }

    const [, token ] = authToken.split(" ");


    try {
        const { tokenId } = jwt.verify(token, process.env.JWT_SECRET! ) as IPayload;

        const apiToken = await prismaClient.token.findUnique({
            where: { id: tokenId }
        });

        if (!apiToken || apiToken.expiration < new Date() || !apiToken.valid) {
            res.status(401).json({
                errorCode: "token expired"
            })
        }

        req.userId = apiToken?.parentId as string;
        
        return next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            errorCode: "token expired"
        })
    }
}