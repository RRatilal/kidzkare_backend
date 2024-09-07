import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    tokenId: string;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({
            errorCode: "Token invalid"
        })
    }

    const [, token ] = authToken.split(" ");


    try {
        const { tokenId } = verify(token, process.env.JWT_SECRET! ) as IPayload

        req.userId = tokenId;
        
        return next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            errorCode: "Token invalid"
        })
    }
}