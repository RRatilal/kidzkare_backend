import { Request, Response } from "express";
import { prismaClient } from "../prisma";
// import { sendSmsNewUser } from "../services/smsServices";

const getSafeLastPulledAt = (request: Request) => {
    const lastPulledAt = request.query.last_pulled_at as string;
    if (!lastPulledAt || lastPulledAt === "null") {
      return new Date(0);
    }
    return new Date(parseInt(lastPulledAt));
  };

export default {
    // async create(req: Request, res: Response) {
    //     const lastPulledAt = getSafeLastPulledAt(req);
    //     console.log(lastPulledAt, req.query.last_pulled_at);

    //     const { name, gender, date, height, weight, parents } = req.body;

    //     try {
    //         const child = await prismaClient.child.create({
    //             data: {
    //                 name,
    //                 date,
    //                 gender,
    //                 height: parseFloat(height),
    //                 weight: parseFloat(weight),
    //                 bloodType: ""
    //             }
    //         })

    //         await Promise.all(
    //             parents.map(async(item: any) => {
    //                 const existingParent = await prismaClient.parent.findUnique({
    //                     where: { number: item.parentPhone },
    //                 })

    //                 if (existingParent) {
    //                     await prismaClient.parentChild.create({
    //                         data: {
    //                             relationship: item.parentDegree,
    //                             child: {
    //                                 connect: {
    //                                     id: child.id
    //                                 }
    //                             },
    //                             Parent: {
    //                                 connect: {
    //                                     id: existingParent.id
    //                                 }
    //                             }
    //                         }
    //                     })
    //                 } else {
    //                     // if (item.parentSelect + item.parentPhone === "+258829056991") {
    //                     //     sendSmsNewUser({
    //                     //         dialCode: item.parentSelect,
    //                     //         number: item.parentPhone
    //                     //     })
    //                     // }
    //                 }
    //             })
    //         );

    //         res.json({child})
    //     } catch (err) {
    //         console.log(err)
    //         res.status(400).json({ error: "Não foi possível criar a criança" });
    //     }
    // },

    async create(req: Request, res: Response) {
        console.log("create");
        const { changes } = req.body;
        if (!changes) {
            return res.status(400).json({ error: "Dados incorrectos" })
        }
        
        const lastPulledAt = getSafeLastPulledAt(req);
        console.log(lastPulledAt, req.query.last_pulled_at);
        console.log("changes", changes);

        try {
            
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar a criança" });
        }
    },

    async getChildren(req: Request, res: Response) {
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

        // const children = await prismaClient.child.findMany({
        //     where: {
        //         parents: {
        //             some: {
        //                 parentId: userId,
        //             }
        //         }
        //     },
        //     include: {
        //         parents: {
        //             select: {
        //                 relationship: true,
        //                 Parent: true
        //             }
        //         }
        //     }
        // })

        res.json(returnObject)
    }
}