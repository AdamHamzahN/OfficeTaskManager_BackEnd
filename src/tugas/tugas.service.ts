import { Injectable } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { UpdateTugasDto } from './dto/update-tugas.dto';

@Injectable()
export class TugasService {
  create(createTugasDto: CreateTugasDto) {
    return 'This action adds a new tugas';
  }

  findAll() {
    return `This action returns all tugas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tugas`;
  }

  update(id: number, updateTugasDto: UpdateTugasDto) {
    return `This action updates a #${id} tugas`;
  }

  remove(id: number) {
    return `This action removes a #${id} tugas`;
  }
}
