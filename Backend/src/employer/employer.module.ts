import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application])],
  providers: [EmployerService],
  controllers: [EmployerController],
})
export class EmployerModule {}
