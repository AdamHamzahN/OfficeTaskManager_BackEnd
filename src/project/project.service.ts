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
import { UpdateNamaTeamDto } from './dto/update-nama-team.dto';

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

  /**
   * Memanggil semua project
   */
  async findAll() {
    const [data, count] = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user').getManyAndCount();
    return {
      data,
      count,
    };
  }

  /**
   * Memanggil project berdasarkan Id
   */
  async findOne(id: string) {
    const project = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.id = :id', { id })
      .getOne();

    return project;
  }


  /**
   * Update Status Project
   */
  async updateStatus(id: string, updateStatusProject: UpdateStatusProject) {
    const project = await this.projectRepository.findOneBy({ id });
    project.status = updateStatusProject.status_project;

    return this.projectRepository.save(project);
  }

  /**
   * Upload File Hasil Project
   */
  async uploadHasil(id: string, uploadHasilProject: UploadHasilProject, file: Express.Multer.File) {
    const project = await this.projectRepository.findOneBy({ id });
    if (uploadHasilProject != null) {
      if (project.file_hasil_project != null) {
        const oldFilePath = path.resolve(project.file_hasil_project);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        //Buat file baru
        project.file_hasil_project = file.path;
      } else {
        // Buat file baru
        project.file_hasil_project = file.path;
      }
      // Simpan perubahan ke database
      return this.projectRepository.save(project);
    }
  }

  /**
   * Update Nama Team
   */
  async updateNamaTeam(id:string,updateNamaTeam : UpdateNamaTeamDto){
    const project = await this.projectRepository.findOneBy({ id });
    project.nama_team = updateNamaTeam.nama_team;

    return this.projectRepository.save(project)
  }

  /**
   * 3 update project terbaru
   */
  async getProjectTerbaru()  {
    return this.projectRepository.find({
      order: {
        created_at: 'DESC',
      },
      take: 3,
    });
  }

  async getProjectDalamProses() {
    const [data,count] = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.status IN (:...statuses)', { statuses: ['pending', 'redo', 'on progress','done'] })
      .getManyAndCount();
    
    return {data , count};
  }
  
  async getProjectSelesai() {
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.status = :status', { status: 'approved' })
      .getCount();
    return data;
  }


  

}
