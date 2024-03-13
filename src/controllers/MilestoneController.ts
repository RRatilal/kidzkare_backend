import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async create(req: Request, res: Response) {
        const { title, description, age, achieved, achievedAt, childId } = req.body
        try {
            await prismaClient.milestone.create({
                data: {
                    title,
                    description,
                    age,
                    achieved,
                    achievedAt,
                    childId,
                }
            })

            res.status(200)
        } catch (error) {
            return console.log(error)
        }
    },

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