

// import { ValidationPipe } from '@nestjs/common';
// import { RolesGuard } from './auth/roles.guard';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: true, // Allow all origins
//     credentials: true,              
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
//     allowedHeaders: ['Content-Type', 'Authorization'],   
//   });
//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // <--- এটি ইম্পোর্ট করুন
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // <--- NestExpressApplication ব্যবহার করুন

  // CORS সক্ষম করুন
  app.enableCors({
    origin: 'http://localhost:3000', // আপনার Next.js ফ্রন্টএন্ডের URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🔥 স্ট্যাটিক ফাইল সার্ভিং সঠিকভাবে সেটআপ করুন 🔥
  // 'uploads' ফোল্ডারের ফাইলগুলো 'http://localhost:3001/uploads' URL থেকে অ্যাক্সেসযোগ্য হবে।
  // এখানে join(__dirname, '..', 'uploads') মানে আপনার প্রজেক্টের রুট ডিরেক্টরির 'uploads' ফোল্ডার।
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // এই প্রিফিক্সটি আপনার resumeLink এর '/uploads/' অংশের সাথে মিলতে হবে।
  });

  await app.listen(process.env.PORT ?? 3001); // নিশ্চিত করুন যে এটি 3001 পোর্টে চলছে
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();