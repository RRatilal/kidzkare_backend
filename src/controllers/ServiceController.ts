import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async create(req: Request, res: Response) {
        const { userId } = req;
        const { name } = req.body;

        try {
            const sercise = await prismaClient.service.create({
                data: {
                    name
                }
            })

            res.json({ sercise })
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar o seriço" }); 
        }
    },

    async getServise(req: Request, res: Response) {

        try {
            const services = await prismaClient.service.findMany();

            res.json({services})
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível encontrar os serviços" }); 
        }
    }
}