// src/file-upload/file-upload.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUpload } from './entities/file-upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload]), // ✅ THIS WAS MISSING
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
