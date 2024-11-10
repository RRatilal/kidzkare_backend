import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async create(req: Request, res: Response) {
        const { title, description, ageRange, categoryName } = req.body
        try {
            let category = await prismaClient.milestoneCategory.findFirst({ where: { name: categoryName } })

            if (!category) {
                category = await prismaClient.milestoneCategory.create({ data: { name: categoryName } })
            }

            let milestone = await prismaClient.milestone.findFirst({ where: { title } })

            if (milestone) {
                return res.json({ milestone })
            }

            milestone = await prismaClient.milestone.create({ 
                data: { title, description, ageRange, categoryId: category.id }})

            res.json({ milestone })
        } catch (error) {
            return console.log("error: Ao criar o marco", error)
        }
    },

    async read(req: Request, res: Response) {
        const { userId } = req
        try {
            const prismaCategories = await prismaClient.milestoneCategory.findMany({
                include: {
                    milestones: {
                        include: {
                            completedBy: {
                                include: {
                                    child: {
                                        include: {
                                            parents: {
                                                where: {
                                                    parentId: userId,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const categories = prismaCategories.map(category => ({
                ...category,
                milestones: category.milestones.map(milestone => ({
                    ...milestone,
                    completedBy: milestone.completedBy.filter(
                        completed => completed.child?.parents.some(
                            parentChild => parentChild.parentId === userId
                        )
                    ),
                })),
            }));

            res.json({ categories })
        } catch (error) {
            return console.error("error: Ao buscar os marcos", error)
        }
    },

    async update(req: Request, res: Response) {
        const { id } = req.params
        const { title, description, ageRange, categoryName } = req.body
        try {
            const milestone = await prismaClient.milestone.update({ where: { id }, data: { title, description, ageRange } })
            res.json({ milestone })
        } catch (error) {
            return console.log("error: Ao atualizar o marco", error)
        }
    },

    async completedBy(req: Request, res: Response) {
        const { id } = req.params
        const { childId } = req.body
        try {
            const child = await prismaClient.child.findUnique({ 
                where: { id: childId } 
            })
            if (!child) {
                return res.json({ message: "Filho não encontrado" })
            }

            const milestone = await prismaClient.milestone.findFirst({
                where: { id }
            })
            if (!milestone) {
                return res.json({ message: "Marco não encontrado" })
            }

            const completedBy = await prismaClient.completedBy.create({ 
                data: { childId, milestoneId: id, completionDate: new Date() } 
            })

            res.json({ completedBy })
        } catch (error) {
            return console.log("error: Ao atualizar o marco", error)
        }
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params
        try {
            await prismaClient.milestone.delete({ where: { id } })
            res.json({ message: "Marco deletado" })
        } catch (error) {
            return console.log("error: Ao deletar o marco", error)
        }
    }
}