import { Module } from '@nestjs/common';

import { SetupModule } from '@/app/setup/setup.module';
import { CustomerModule } from '@/app/customer/customer.module';

@Module({
  imports: [SetupModule, CustomerModule],
  providers: [],
})
export class AppModule {}
