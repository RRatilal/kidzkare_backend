import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async create(req: Request, res: Response) {
        const { name, advantage, description, } = req.body;

        try {
            const breastfeeding = await prismaClient.breastfeeding.create({
                data: {
                    name,
                    advantage,
                    description
                }
            })

            res.json({ breastfeeding })
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar a dica de amamentação" }); 
        }
    },

    async getFoodPan(req: Request, res: Response) {

        try {
            const breastfeeding = await prismaClient.breastfeeding.findMany();

            res.json({breastfeeding})
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível encontrar as dicas de amamentação" }); 
        }
    }
}