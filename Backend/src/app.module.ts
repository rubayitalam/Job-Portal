
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { EmployerModule } from './employer/employer.module';
// import { CareerResourcesModule } from './career-resources/career-resources.module';

// import { User } from './user/user.entity';
// import { Job } from './employer/entities/job.entity';
// import { Application } from './employer/entities/application.entity';
// import { Article } from './career-resources/entities/article.entity';
// import { Template } from './career-resources/entities/template.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: '12345678',
//       database: 'postgres',
//       entities: [User, Job, Application, Article, Template], 
//       synchronize: true,
//     }),
//     UserModule,
//     AuthModule,
//     EmployerModule,
//     CareerResourcesModule,
//   ],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployerModule } from './employer/employer.module';
import { CareerResourcesModule } from './career-resources/career-resources.module';

import { User } from './user/user.entity';
import { Job } from './employer/entities/job.entity';
import { Application } from './employer/entities/application.entity';
import { Article } from './career-resources/entities/article.entity';
import { Template } from './career-resources/entities/template.entity';
import { User1 } from './auth/user1.entity';  // Add this import

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'jobportal',
      entities: [User, Job, Application, Article, Template, User1],  // Add User1 here
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    EmployerModule,
    CareerResourcesModule,
  ],
})
export class AppModule {}
