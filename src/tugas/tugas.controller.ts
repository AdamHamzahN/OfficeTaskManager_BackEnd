import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { UpdateTugasDto } from './dto/update-tugas.dto';

@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService) {}

  @Post()
  create(@Body() createTugasDto: CreateTugasDto) {
    return this.tugasService.create(createTugasDto);
  }

  @Get()
  findAll() {
    return this.tugasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tugasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTugasDto: UpdateTugasDto) {
    return this.tugasService.update(+id, updateTugasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tugasService.remove(+id);
  }
}
