import { Test, TestingModule } from '@nestjs/testing';
import { CareerResourcesService } from './career-resources.service';

describe('CareerResourcesService', () => {
  let service: CareerResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareerResourcesService],
    }).compile();

    service = module.get<CareerResourcesService>(CareerResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
