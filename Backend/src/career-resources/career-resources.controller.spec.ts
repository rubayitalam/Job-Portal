import { Test, TestingModule } from '@nestjs/testing';
import { CareerResourcesController } from './career-resources.controller';

describe('CareerResourcesController', () => {
  let controller: CareerResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareerResourcesController],
    }).compile();

    controller = module.get<CareerResourcesController>(CareerResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
