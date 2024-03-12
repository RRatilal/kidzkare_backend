import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import { sendSmsNewUser } from "../services/smsServices";

export default {
    async create(req: Request, res: Response) {
        const { userId } = req;
        const { name, gender, date, height, weight, parents } = req.body;

        try {
            const child = await prismaClient.child.create({
                data: {
                    name,
                    date,
                    gender,
                    height: parseFloat(height),
                    weight: parseFloat(weight),
                    bloodType: ""
                }
            })

            await Promise.all(
                parents.map(async(item: any) => {
                    const existingParent = await prismaClient.parent.findUnique({
                        where: { number: item.parentPhone },
                    })

                    if (existingParent) {
                        await prismaClient.parentChild.create({
                            data: {
                                relationship: item.parentDegree,
                                child: {
                                    connect: {
                                        id: child.id
                                    }
                                },
                                Parent: {
                                    connect: {
                                        id: existingParent.id
                                    }
                                }
                            }
                        })
                    } else {
                        // if (item.parentSelect + item.parentPhone === "+258829056991") {
                        //     sendSmsNewUser({
                        //         dialCode: item.parentSelect,
                        //         number: item.parentPhone
                        //     })
                        // }
                    }
                })
            );

            res.json({child})
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar a criança" });
        }
    },

    async getChildren(req: Request, res: Response) {
        const { userId } = req;
        const children = await prismaClient.child.findMany({
            where: {
                parents: {
                    some: {
                        parentId: userId,
                    }
                }
            },
            include: {
                parents: {
                    select: {
                        relationship: true,
                        Parent: true
                    }
                }
            }
        })

        res.json({ children })
    }
}