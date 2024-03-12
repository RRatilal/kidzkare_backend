import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export default {
    async create(req: Request, res: Response) {
        const { date, breakfast, morningSnack, lunch, doctorId, childId } = req.body;

        try {
            const doctor = await prismaClient.doctor.findUnique({
                where: { id: doctorId },
                include: {
                    specialties: {
                        select: {
                            Specialty: true
                        }
                    }
                }
            })

            console.log(doctor)


            const isNutritionist = doctor?.specialties.some(specialty => specialty.Specialty?.name === "Nutricionista")
            if (!isNutritionist) {
                res.status(400).json({ msg: 'Este médico não é um nutricionista. Apenas nutricionistas podem criar planos de alimentação.' })
            }

            const foodPlan = await prismaClient.foodPlan.create({
                data: {
                    date: new Date(new Date().getTime()),
                    breakfast,
                    morningSnack,
                    lunch,
                    afternoonSnack: "",
                    dinner: "",
                    eveningSnack: "",
                    doctorId,
                    childId
                }
            })

            res.json({ foodPlan })
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível criar o plano de alimentação" }); 
        }
    },

    async getFoodPan(req: Request, res: Response) {

        try {
            const foodPlans = await prismaClient.foodPlan.findMany({
                include: {
                    child: true,
                }
            });

            res.json({foodPlans})
        } catch (err) {
            console.log(err)
            res.status(400).json({ error: "Não foi possível encontrar os serviços" }); 
        }
    }
}