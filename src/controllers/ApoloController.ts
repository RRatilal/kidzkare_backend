import { Request, Response} from "express";
import axios from "axios";
import querystring from 'querystring';
import { prismaClient } from "../prisma";


export default {
    async apolo(req: Request, res: Response) {
        const formData = {
            grant_type: process.env.APOLO_GRANT_TYPE, 
            account: process.env.APOLO_ACCOUNT,
            username: process.env.APOLO_USERNAME,
            password: process.env.APOLO_PASSWORD,
            accountUnit: process.env.APOLO_ACCOUNTUNIT
        }
        const body = querystring.stringify(formData);

        try {
            const result = await axios.post("https://api.ninsaude.com/v1/oauth2/token", body,
            {
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded"
            }
            })

            console.log("result",result.data.access_token)

            const refresh_token = await prismaClient.apoloAuth.findFirst()

            if (!refresh_token) {
                await prismaClient.apoloAuth.create({
                    data: {
                        refresh_token: result.data.refresh_token
                    }
                })
            } else {
                await prismaClient.apoloAuth.update({
                    where: {
                        id: refresh_token.id
                    },
                    data: {
                        refresh_token: result.data.refresh_token
                    }
                })
            }


            const access_token = result.data.access_token

            res.json({access_token})
        } catch (error) {
            console.log({error: true, message: (error as any).response.data.error})
            return {error: true, message: (error as any).response.data.error}
        }
    },

    async token(req: Request, res: Response) {
        try {
            const refreshTokenRecord  = await prismaClient.apoloAuth.findFirst();

            if (!refreshTokenRecord ?.refresh_token) {
                return res.status(404).json({ error: "Refresh token não encontrado" });
            }

            const accessTokenData = {
                grant_type: process.env.APOLO_GRANT_TYPE_REFRESH,
                refresh_token: refreshTokenRecord ?.refresh_token,
            }

            const body = querystring.stringify(accessTokenData);

            const result = await axios.post("https://api.ninsaude.com/v1/oauth2/token", body,
            {
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
            })

            
            
            if (result?.data) {
                const access_token = result.data.access_token;
                return res.json({ access_token });
            } else {
                // Caso a resposta não contenha os dados esperados
                console.error("Resposta inválida da API:", result);
                return res.status(500).json({ error: "Resposta inválida da API" });
            }

            
        } catch (error) {
            console.log({error: true, message: (error as any).response.data.error})
            return {error: true, message: (error as any).response.data.error}
        }
    }
}