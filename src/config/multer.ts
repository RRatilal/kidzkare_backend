import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Credenciais da conta de serviço
const KEYFIKEPATH = path.join(__dirname, '..', '..', "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFIKEPATH,
    scopes: SCOPES
})

const drive = google.drive({ version: "v3", auth })

// Função para fazer upload para o Google Drive
const uploadFileToDrive = async (filePath: string, fileName: string) => {
    try {
        const fileMetadata = {
            name: fileName,
            parents: ['1SoqdZY3VN8oXUZwCcSiywXavYpeghcy3']
        };

        const media = {
            mimeType: 'image/jpeg', // Ajuste para outros tipos, se necessário
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            media: media,
            fields: 'id',
            requestBody: fileMetadata
        });

        return response.data.id; // Retorna o ID do arquivo no Google Drive
    } catch (error) {
        console.error('Erro ao enviar para o Google Drive:', error);
        throw new Error('Erro no upload do arquivo');
    }
};

// Configuração do multer para armazenamento temporário
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'), // Pasta temporária
    filename(_, file, cb) {
        const hash = crypto.randomBytes(6).toString('hex');
        const filename = `${hash}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Middleware para upload e envio ao Google Drive
const uploadToDrive = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return { driveFileId: null };
    }

    try {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', req.file.filename);
        const driveFileId = await uploadFileToDrive(filePath, req.file.filename);

        // Remova o arquivo da pasta temporária após o upload
        fs.unlinkSync(filePath);

        return { driveFileId };
        // res.status(200).send({ message: 'Arquivo enviado com sucesso ao Google Drive', fileId: driveFileId });
    } catch (error) {
        next(error);
        return { driveFileId: null };
    }
};

export { upload, uploadToDrive };
