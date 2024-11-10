import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../prisma";
import { uploadToDrive } from "../config/multer";
// import { sendSmsNewUser } from "../services/smsServices";

const getSafeLastPulledAt = (request: Request) => {
    const lastPulledAt = request.query.last_pulled_at as string;
    if (!lastPulledAt || lastPulledAt === "null") {
      return new Date(0);
    }
    return new Date(parseInt(lastPulledAt));
  };

export default {
    async create(req: Request, res: Response, next: NextFunction) {

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

            const parsedParents = JSON.parse(parents);

            await Promise.all(
                parsedParents.map(async(item: any) => {
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

            const { driveFileId } = await uploadToDrive(req, res, next);

            if (driveFileId) {
                await prismaClient.avatar.create({
                    data: {
                        child: {
                            connect: {
                                id: child.id
                            }
                        },
                        driveFileId
                    }
                })
            }

            res.json({child})
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar a criança" });
        }
    },
    

    async read(req: Request, res: Response) {
        try {
            const lastPulledAt = getSafeLastPulledAt(req);
            const { userId } = req;
    
            const created = await prismaClient.child.findMany({
                where: { 
                    createdAt: { gt: lastPulledAt },
                    parents: {
                        some: { parentId: userId }
                    }
                }
            });
    
            const updated = await prismaClient.child.findMany({
                where: { 
                    AND: [{ updatedAt: { gt: lastPulledAt } }, { createdAt: { lte: lastPulledAt } }],
                    parents: {
                        some: { parentId: userId }
                    }
                }
            });
    
            const returnObject = {
                changes: {
                    children: {
                        created,
                        updated,
                        deleted: [],
                    }
                },
                timestamp: Date.now(),
            }
    
            // Envia a resposta e garante que nenhuma outra lógica será executada após
            return res.json(returnObject);
        } catch (error) {
            // Em caso de erro, responde com status 500 e encerra a execução
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar crianças" });
        }
    }
    
}