
import { Controller, Post, Get, Body, Param, Put, Delete, Query, UploadedFile,
  UseInterceptors,} from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployerService } from './employer.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('jobs')
  createJob(@Body() dto: CreateJobDto) {
    return this.employerService.createJob(dto);
  }

  @Get('jobs')
  findAllJobs(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
  ) {
    return this.employerService.getAllJobs(page, search);
  }

  @Put('jobs/:id')
  updateJob(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.employerService.updateJob(id, dto);
  }

  @Delete('jobs/:id')
  deleteJob(@Param('id') id: string) {
    return this.employerService.deleteJob(id);
  }

  @Get('jobs/:id/applications')
  getApplications(@Param('id') id: string) {
    return this.employerService.getApplications(id);
  }

//   @Post('applications')
//   submitApplication(@Body() data: any) {
//     return this.employerService.submitApplication(data);
//   }
// }
@Post('applications')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes', // Make sure this folder exists
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `resume-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
async submitApplication(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: { jobId: string; candidateName: string; email: string; status?: string },
) {
  const resumeLink = `http://localhost:3001/uploads/resumes/${file.filename}`; // <--- এটি নিশ্চিত করুন যে 3001 পোর্ট আছে
  const applicationData = {
    jobId: body.jobId,
    candidateName: body.candidateName,
    email: body.email,
    resumeLink,
    status: body.status || 'Pending',
  };
  return this.employerService.submitApplication(applicationData);
}
}

  
// POST    http://localhost:3000/employer/jobs
// GET     http://localhost:3000/employer/jobs
// GET     http://localhost:3000/employer/jobs?page=1
// GET     http://localhost:3000/employer/jobs?search=developer
// PUT     http://localhost:3000/employer/jobs/{id}
// DELETE  http://localhost:3000/employer/jobs/{id}
// GET     http://localhost:3000/employer/jobs/{id}/applications
// POST    http://localhost:3000/employer/applications
