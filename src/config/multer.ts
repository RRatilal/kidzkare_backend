import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(_, file, cb) {
            const hash = crypto.randomBytes(6).toString('hex');

            const filename = `${hash}-${file.originalname}`;

            cb(null, filename)
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_: Request, file: Express.Multer.File, cb: any) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type"))
        }
    }
}