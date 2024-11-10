import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// prismaClient.$use(async (params, next) => {
//     // Interceptar as operações de create, update e delete
//     const result = await next(params);
  
//     if (['create', 'update', 'delete'].includes(params.action)) {
//       let changeType: 'created' | 'updated' | 'deleted';
      
//       switch (params.action) {
//         case 'create':
//           changeType = 'created';
//           break;
//         case 'update':
//           changeType = 'updated';
//           break;
//         case 'delete':
//           changeType = 'deleted';
//           break;
//         default:
//           throw new Error(`Ação inesperada: ${params.action}`);
//       }
  
//       // Registrar a mudança na tabela 'Change'
//       await prismaClient.changes.create({
//         data: {
//           tableName: params.model as string,
//           changeType,
//           recordId: params.args.where?.id || result.id,
//           data: params.action !== 'delete' ? params.args.data : null,
//         },
//       });
//     }
  
//     return result;
//   });

export { prismaClient }