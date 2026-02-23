// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
// import { AdminSubscription } from './admin-subscription.entity';


// @Entity()
// export class AdminSubscriptionUsage {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @OneToOne(() => AdminSubscription, { onDelete: 'CASCADE' })
//   @JoinColumn()
//   subscription: AdminSubscription;

//   @Column({ default: 0 })
//   productCreated: number;

//   @Column({ default: 0 })
//   productEdited: number;

//   @Column({ default: 0 })
//   promptCreated: number;

//   @Column({ default: 0 })
//   promptEdited: number;
// }


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AdminSubscription } from './admin-subscription.entity';

@Entity()
export class AdminSubscriptionUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AdminSubscription, { onDelete: 'CASCADE' })
  @JoinColumn()
  subscription: AdminSubscription;

  @Column({ default: 0 })
  productCreated: number;

  @Column({ default: 0 })
  productEdited: number;

  @Column({ default: 0 })
  promptCreated: number;

  @Column({ default: 0 })
  promptEdited: number;
}