// src/file-upload/entities/file-upload.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
