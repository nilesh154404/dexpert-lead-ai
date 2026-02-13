// src/file-upload/file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly repo: Repository<FileUpload>,
  ) {}

  async saveFile(file: Express.Multer.File) {
    const fileUrl = `/uploads/${file.filename}`;

    const saved = this.repo.create({
      fileName: file.originalname,
      fileUrl,
    });

    await this.repo.save(saved);

    return {
      message: 'File uploaded successfully',
      fileUrl,
    };
  }
}
