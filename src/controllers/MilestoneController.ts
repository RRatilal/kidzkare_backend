import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async milestone(req: Request, res: Response) {
        try {
            const milestones = await prismaClient.milestone.findMany({
                include: {
                    child: true
                }
            })

            res.json({ milestones })
        } catch (error) {
            return console.log(error)
        }
    }
}