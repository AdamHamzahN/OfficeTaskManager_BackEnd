import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';
import { Project, statusProject } from '#/project/entities/project.entity';
import { TugasService } from '#/tugas/tugas.service';


@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Karyawan)
    private karyawanRepository: Repository<Karyawan>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    private tugasService: TugasService
  ) { }

  async create(createTeamDto: CreateTeamDto) {
    // Check if Team with the same karyawan and project already exists
    const existingTeam = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project', 'project')
      .where('karyawan.id = :karyawanId', { karyawanId: createTeamDto.id_karyawan })
      .andWhere('project.id = :projectId', { projectId: createTeamDto.id_project })
      .getOne();


    // jika karyawan sudah berada di team tersebut
    if (existingTeam) {
      throw new ConflictException(`Karyawan ini sudah menjadi anggota di ${existingTeam.project.nama_team}`);
    }

    // Buat Team Baru
    const newTeam = this.teamRepository.create({
      karyawan: createTeamDto.id_karyawan,
      project: createTeamDto.id_project
    });

    return this.teamRepository.save(newTeam);

  }


  async findAll() {
    return await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project', 'project')
      .getMany();
  }

  async findOne(id: string) {
    const team = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project', 'project')
      .where('team.id = :id', { id })
      .getOne();

    return team;
  }

  async projectKaryawan(id: string) {
    return await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project', 'project')
      .where('karyawan.id = :id', { id })
      .andWhere('project.status != :status', { status: statusProject.approved })
      .getMany();
  }

  async history(id: string) {
    const data = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project', 'project')
      .leftJoinAndSelect('project.tugas', 'tugas')
      .where('karyawan.id = :id', { id })
      .andWhere('tugas.status IN (:...statuses)', { statuses: ['done', 'redo'] })
      .getMany();

    return data;
  }

  async teamProject(id: string) {
    const data = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.project', 'project')
      .leftJoinAndSelect('team.karyawan', 'karyawan')// Menampilkan relasi tugas.karyawan
      .leftJoin('karyawan.user', 'user')
      .addSelect('user.nama')
      .leftJoin('karyawan.job', 'job')
      .addSelect('job.nama_job')
      .where('project.id = :id', { id })
      .getMany();
  
    return data;
  }
  
  





}






