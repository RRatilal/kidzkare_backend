import { Request, Response} from "express";
import { prismaClient } from "../prisma";
import { PrismaClient,  } from "@prisma/client";

type TableNames = keyof typeof prismaClient;

export default {
    async pull(req: Request, res: Response) {
        const { last_pulled_at } = req.body;

        try {
            let changes = [];

            if (last_pulled_at) {
                changes = await prismaClient.changes.findMany({
                    where: {
                        createdAt: {
                            gt: new Date(parseInt(last_pulled_at as string))
                        }
                    }
                })
            } else {
                changes = await prismaClient.changes.findMany();
            }

            const timestamp = Date.now();

            res.json({ changes, timestamp });
        } catch (error) {
            console.error("Erro ao obter as mudanças", error);
            res.status(500).json({ error: "Erro ao obter as mudanças" });
        }
    },

    async push(req: Request, res: Response) {
        const { changes, lastPulledAt } = req.body; 

  try {
    // Inicia uma transação
    await prismaClient.$transaction(async (tx) => {
      // Itera sobre cada tabela no objeto de mudanças
      for (const tableName in changes) {
        const { created, updated, deleted } = changes[tableName  as TableNames];

        const table = tx[tableName];
        console.log("Tabela:", tableName, "Criados:", created, "Atualizados:", updated, "Excluídos:", deleted);

        // 1. Aplicar inserções
        for (const record of created) {
          const existingRecord = await table.findUnique({ where: { id: record.id } });

          if (existingRecord) {
            // Atualizar se já existir
            await table.update({
              where: { id: record.id },
              data: record,
            });
          } else {
            // Criar novo registro
            await table.create({
              data: record,
            });
          }
        }

        // 2. Aplicar atualizações
        for (const record of updated) {
          const existingRecord = await table.findUnique({ where: { id: record.id } });

          if (existingRecord) {
            // Verifica se houve modificações no servidor após o último pull
            if (existingRecord.updatedAt > new Date(lastPulledAt)) {
              // Conflito: abortar a transação e retornar erro
              throw new Error(`Conflict on record with ID ${record.id}`);
            }

            // Atualizar registro existente
            await table.update({
              where: { id: record.id },
              data: record,
            });
          } else {
            // Se não existir, criar o registro
            await table.create({
              data: record,
            });
          }
        }

        // 3. Aplicar exclusões
        for (const id of deleted) {
          const existingRecord = await table.findUnique({ where: { id } });

          if (existingRecord) {
            // Deletar registro e seus descendentes, se aplicável
            await table.delete({ where: { id } });
          }
          // Ignorar exclusões de registros inexistentes
        }
      }
    });

    // Se tudo deu certo, retorna sucesso
    res.status(200).json({ success: true });

  } catch (error) {
    // Em caso de erro, a transação será revertida automaticamente
    console.error(error);
    res.status(409).json({ error });
  }
    }
}