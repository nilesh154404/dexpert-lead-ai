// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SubscriptionPlan } from './entities/subscription-plan.entity';
// import { AdminSubscription } from './entities/admin-subscription.entity';
// import { SubscriptionService } from './subscription.service';
// import { SubscriptionController } from './subscription.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([SubscriptionPlan, AdminSubscription])],
//   providers: [SubscriptionService],
//   controllers: [SubscriptionController],
//   exports: [SubscriptionService],
// })
// export class SubscriptionModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SubscriptionPlan } from './entities/subscription-plan.entity';
// import { AdminSubscription } from './entities/admin-subscription.entity';
// import { AdminSubscriptionUsage } from './entities/admin-subscription.entity';
// import { SubscriptionService } from './subscription.service';
// import { SubscriptionController } from './subscription.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       SubscriptionPlan,
//       AdminSubscription,
//       AdminSubscriptionUsage, // 🔥 REQUIRED
//     ]),
//   ],
//   providers: [SubscriptionService],
//   controllers: [SubscriptionController],
//   exports: [SubscriptionService],
// })
// export class SubscriptionModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { AdminSubscription } from './entities/admin-subscription.entity';
import { AdminSubscriptionUsage } from './entities/admin-subscription-usage.entity';

import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      AdminSubscription,
      AdminSubscriptionUsage,
    ]),
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}