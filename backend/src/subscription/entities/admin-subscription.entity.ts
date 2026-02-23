import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';

// @Entity()
// export class AdminSubscription {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   adminId: string;

//   @ManyToOne(() => SubscriptionPlan)
//   @JoinColumn({ name: 'planId' })
//   plan: SubscriptionPlan;

//   @Column()
//   planId: number;

//   @Column()
//   startDate: Date;

//   @Column()
//   endDate: Date;

//   @Column({ default: 'active' })
//   status: string; // active, expired, etc.

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }


@Entity()
export class AdminSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  adminId: string; // UUID from users table

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Column()
  planId: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}