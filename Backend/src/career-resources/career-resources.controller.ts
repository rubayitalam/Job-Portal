
import { Controller, Post, Body, Get, Param, UploadedFile, UseInterceptors, Res, UseGuards } from '@nestjs/common';
import { CareerResourcesService } from './career-resources.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Article } from './entities/article.entity';
import { Template } from './entities/template.entity';
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('career-resources')
//@UseGuards(JwtAuthGuard)
export class CareerResourcesController {
  constructor(private readonly careerResourcesService: CareerResourcesService) {}

  // Create a new article
  @Post('create-article')
  @Roles(Role.Admin)
  async createArticle(@Body() body: { title: string, content: string }): Promise<Article> {
    const { title, content } = body;
    return this.careerResourcesService.createArticle(title, content);
  }


  // Get all articles
  @Get('articles')
  @Roles(Role.Admin)
  async getAllArticles(): Promise<Article[]> {
    return this.careerResourcesService.getAllArticles();
  }

  // Create a new template with file upload
  @Post('upload-template')

  @UseInterceptors(FileInterceptor('file')) 
  async uploadTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ): Promise<Template> {
    const template = await this.careerResourcesService.createTemplate(name || file.originalname, file.buffer);
    return template;
  }

  // Get all templates
 
  @Get('templates')
  @Roles(Role.Admin)
  async getAllTemplates(): Promise<Template[]> {
    return this.careerResourcesService.getAllTemplates();
  }

  // Download the template file by ID
  @Get('download-template/:id')
  @Roles(Role.Admin)
  async downloadTemplate(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const template = await this.careerResourcesService.getTemplateById(id);

    if (!template) {
      res.status(404).send('Template not found');
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${template.name.replace(/\s+/g, '_')}.pdf"`);
    res.send(template.filecontent);
  }
 }
// POST    /career-resources/create-article
// GET     /career-resources/articles
// POST    /career-resources/upload-template
// GET     /career-resources/templates
// GET     /career-resources/download-template/:id
