// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Job } from './entities/job.entity';
// import { Application } from './entities/application.entity';

// @Injectable()
// export class EmployerService {
//   constructor(
//     @InjectRepository(Job) private jobRepo: Repository<Job>,
//     @InjectRepository(Application) private appRepo: Repository<Application>,
//   ) {}

//   createJob(data: Partial<Job>) {
//     const job = this.jobRepo.create(data);
//     return this.jobRepo.save(job);
//   }

//   getAllJobs() {
//     return this.jobRepo.find();
//   }

//   async updateJob(id: string, updates: Partial<Job>) {
//     const job = await this.jobRepo.findOneBy({ id });
//     if (!job) throw new NotFoundException('Job not found');
//     await this.jobRepo.update(id, updates);
//     return { ...job, ...updates };
//   }

//   async deleteJob(id: string) {
//     const job = await this.jobRepo.findOneBy({ id });
//     if (!job) throw new NotFoundException('Job not found');
//     await this.jobRepo.delete(id);
//     return { message: 'Job deleted successfully' };
//   }

//   getApplications(jobId: string) {
//     return this.appRepo.find({ where: { jobId } });
//   }

//   submitApplication(data: Partial<Application>) {
//     const app = this.appRepo.create(data);
//     return this.appRepo.save(app);
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(Application) private readonly appRepo: Repository<Application>,
  ) {}

  async createJob(data: Partial<Job>) {
    const job = this.jobRepo.create(data);
    return await this.jobRepo.save(job);
  }

  async getAllJobs(page: number = 1, search: string = '') {
    const pageSize = 5;
    const [jobs, total] = await this.jobRepo.findAndCount({
      where: search ? { title: Like(`%${search}%`) } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' }, // optional: latest first
    });
    return {
      data: jobs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateJob(id: string, updates: Partial<Job>) {
    const job = await this.jobRepo.findOneBy({ id });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobRepo.update(id, updates);
    return { ...job, ...updates };
  }

  async deleteJob(id: string) {
    const job = await this.jobRepo.findOneBy({ id });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobRepo.delete(id);
    return { message: 'Job deleted successfully' };
  }

  async getApplications(jobId: string) {
    return await this.appRepo.find({ where: { jobId } });
  }

  async submitApplication(data: Partial<Application>) {
    const app = this.appRepo.create(data);
    return await this.appRepo.save(app);
  }
}
