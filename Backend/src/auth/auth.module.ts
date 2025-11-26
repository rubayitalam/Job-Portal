
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User1 } from './user1.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User1]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // secret key from env file
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { User1 } from './user1.entity';  // ✅ correct path to your entity
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User1]),  // ✅ register the entity here
//     JwtModule.register({
//       secret: 'yourSecret',
//       signOptions: { expiresIn: '1d' }
//     })
//   ],
//   providers: [AuthService],
//   controllers: [AuthController],
//   exports: [AuthService]
// })
// export class AuthModule {}
