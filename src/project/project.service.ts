import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '#/users/entities/user.entity';
import { UpdateStatusProject } from './dto/update-status.dto';
import { UploadHasilProject } from './dto/upload-bukti.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  /**
   * Membuat project Baru
   */
  async create(createProjectDto: CreateProjectDto, file: Express.Multer.File) {
    const project = new Project();
    project.nama_project = createProjectDto.nama_project;
    project.nama_team = createProjectDto.nama_team;
    project.deskripsi = createProjectDto.deskripsi;
    project.start_date = new Date(createProjectDto.start_date);
    project.end_date = new Date(createProjectDto.end_date)
    project.user = createProjectDto.id_team_lead;
    project.file_project = file?.path;

    return await this.projectRepository.save(project);
  }

  async findAll() {
    const [data, count] = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user').getManyAndCount();
    return {
      data,
      count,
    };
  }

  async findOne(id: string) {
    return await this.projectRepository.findOneOrFail({
      where: {
        id,
      },
    });

  }

  async updateStatus(id: string, updateStatusProject: UpdateStatusProject) {
    const project = await this.projectRepository.findOneBy({ id });
    // const job = await this.jobRepository.findOneBy({ id: editJobDto.job });
    project.status = updateStatusProject.status_project;

    return this.projectRepository.save(project);
  }


  async uploadHasil(id: string, uploadHasilProject: UploadHasilProject, file: Express.Multer.File) {
    const project = await this.projectRepository.findOneBy({ id });
    if (uploadHasilProject != null) {
      if (project.file_hasil_project != null) {
        const oldFilePath = path.resolve(project.file_hasil_project);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (err) {
          console.error('Error while deleting old file:', err);
          throw new Error('Could not delete old file');
        }
        project.file_hasil_project = file.path;
      } else {
        // Buat file baru
        project.file_hasil_project = file.path;
      }
      // Simpan perubahan ke database
      return this.projectRepository.save(project);
    }
  }

}
