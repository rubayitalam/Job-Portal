// career-resources.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerResourcesService } from './career-resources.service';
import { CareerResourcesController } from './career-resources.controller';
import { Article } from './entities/article.entity';
import { Template } from './entities/template.entity';
//import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Template]) 
  ],
  controllers: [CareerResourcesController],
  //providers: [CareerResourcesService],
  providers: [CareerResourcesService],
})
export class CareerResourcesModule {}
