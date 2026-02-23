import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  durationMonths: number;


  @Column()
  productCreateLimit: number;

  @Column()
  productEditLimit: number;

  @Column()
  promptCreateLimit: number;

  @Column()
  promptEditLimit: number;

  // @Column({ nullable: true })
  // createdBy: number; // superadmin id

  @Column({ type: 'varchar', nullable: true })
createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
