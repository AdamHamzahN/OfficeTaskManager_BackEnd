import { Test, TestingModule } from '@nestjs/testing';
import { TugasController } from './tugas.controller';
import { TugasService } from './tugas.service';

describe('TugasController', () => {
  let controller: TugasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TugasController],
      providers: [TugasService],
    }).compile();

    controller = module.get<TugasController>(TugasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
