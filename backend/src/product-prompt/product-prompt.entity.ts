import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('product_prompt')
export class ProductPrompt {
  @PrimaryGeneratedColumn({ name: 'prompt_id' })
  promptId: number;

  @Column({ name: 'tenant_id', type: 'varchar', nullable: false })
  tenantId: string;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number;

  @Column({ name: 'text', type: 'longtext', nullable: false })
  text: string;

  @Column({ name: 'version', type: 'varchar', nullable: false })
  version: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'varchar', nullable: false })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
