// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// @Entity('product')
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   product_name: string;

//   @Column({ name: 'tenant_id' })
//   tenant_id: string;

//   @Column({ name: 'created_by' })
//   created_by: string;

//   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
//   created_at: Date;
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  // ✅ Description (optional)
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Tenant / organisation ID
  @Column()
  tenant_id: string;

  // OrgAdmin (user) who created the product
  // @Column()
  // created_by: string;
  // ✅ Status (Active / Inactive)
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
