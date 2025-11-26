
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Template } from './entities/template.entity';

@Injectable()
export class CareerResourcesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,

    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  // Create new article
  async createArticle(title: string, content: string): Promise<Article> {
    const article = new Article();
    article.title = title;
    article.content = content;
    return await this.articleRepository.save(article);
  }

  // Get all articles
  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  //  new template createn + file upload
  async createTemplate(name: string, file: Buffer): Promise<Template> {
    const template = new Template();
    template.name = name;
    template.filecontent = file; 
    return await this.templateRepository.save(template);
  }

  // Get all templates
  async getAllTemplates(): Promise<Template[]> {
    return await this.templateRepository.find();
  }

  // Fetch template ID
  async getTemplateById(id: number): Promise<Template | null> {
    return await this.templateRepository.findOne({ where: { id } });
  }
}
