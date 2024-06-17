// import { Request, Response} from "express";
// import { prismaClient } from "../prisma";

// export default {
//     async pull(req: Request, res: Response) {
//         const { last_pulled_at } = req.query;

//         try {
//             // Parâmetro opcional para indicar a última sincronização do cliente
//             const lastSyncTime = req.query.lastSyncTime;
        
//             let changes = [];
            
//             // Consulta SQL para obter todas as mudanças desde a última sincronização do cliente
//             if (lastSyncTime) {
//               changes = await prismaClient.$queryRaw(`
//                 SELECT *
//                 FROM changes
//                 WHERE timestamp > ?
//               `, lastSyncTime);
//             } else {
//               // Se não houver lastSyncTime, obter todas as mudanças
//               changes = await prismaClient.$queryRaw(`
//                 SELECT *
//                 FROM changes
//               `);
//             }
        
//             res.status(200).json(changes);
//           } catch (error) {
//             console.error('Erro ao obter mudanças para sincronização:', error);
//             res.status(500).send('Erro ao obter mudanças para sincronização');
//           }

//         console.log(req.query)
//     },

//     async push(req: Request, res: Response) {
//         const { changes } = req.body;

//         console.log(changes)
//     }
// }