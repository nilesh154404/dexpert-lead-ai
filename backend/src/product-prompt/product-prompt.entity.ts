// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
// import { Product } from '../entities/product.entity';

// @Entity('prompt')
// export class Prompt {
//   @PrimaryGeneratedColumn()
//   prompt_id: number;

//   @Column()
//   @Index()
//   product_id: number;

//   @Column()
//   tenant_id: string;

//   @Column('longtext')
//   prompt_text: string;

//   @Column()
//   version: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @Column()
//   created_by: string;

//   @ManyToOne(() => Product)
//   product: Product;
// }

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
//   Index,
//   JoinColumn,
// } from 'typeorm';
// import { Product } from '../entities/product.entity';

// @Entity('prompt')
// export class Prompt {
//   @PrimaryGeneratedColumn()
//   prompt_id: number;

//   @Column()
//   @Index()
//   product_id: number;

//   @Column()
//   tenant_id: string;

//   @Column('longtext')
//   prompt_text: string;

//   @Column({ length: 32 })
//   version: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @Column()
//   created_by: string;

//   @ManyToOne(() => Product)
//   @JoinColumn({ name: 'product_id' })
//   product: Product;
// }


// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Product } from '../entities/product.entity';

// @Entity('prompt')
// export class Prompt {
//   @PrimaryGeneratedColumn()
//   prompt_id: number;

//   @Column()
//   product_id: number;

//   @Column()
//   tenant_id: string;

//   @Column('longtext')
//   prompt_text: string;

//   @Column({ length: 32 })
//   version: string;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;

//   @Column()
//   created_by: string;

//   @ManyToOne(() => Product)
//   @JoinColumn({ name: 'product_id' })
//   product: Product;
// }


// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   Index,
// } from 'typeorm';

// @Entity('prompt')
// export class Prompt {
//   @PrimaryGeneratedColumn()
//   prompt_id: number;

//   @Index()
//   @Column()
//   product_id: number;

//   @Column()
//   tenant_id: string;

//   @Column('longtext')
//   prompt_text: string;

//   @Column({ length: 32 })
//   version: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @Column()
//   created_by: string;
// }


import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prompt')
export class Prompt {
  @PrimaryGeneratedColumn()
  prompt_id: number;

  @Column()
  product_id: number;

  @Column()
  tenant_id: string;

  @Column('longtext')
  prompt_text: string;

  @Column()
  version: string;

  @Column()
  created_by: string;

  @Column({ default: false })
  is_production: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
