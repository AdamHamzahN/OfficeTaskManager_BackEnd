import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { Karyawan, statusProject as statusProjectKaryawan } from '#/karyawan/entities/karyawan.entity';
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

  async history(id: string, search: string) {
    const data = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('karyawan.user', 'user')
      .leftJoinAndSelect('team.project', 'project')
      .leftJoinAndSelect('project.tugas', 'tugas')
      .where('user.id = :id', { id });

    if (search) {
      data.andWhere('project.nama_project LIKE :search', { search: `%${search}%` });
    }

    data.orderBy('team.created_at', 'DESC');
    const result = await data.getMany();

    const formattedResult = {
      data: result.map(item => ({
        project: {
          id: item.project.id,
          nama_project: item.project.nama_project,
        },
        tugas: item.project.tugas
          .filter(t => t.status === 'done' || t.status === 'redo')
          .map(t => ({
            nama_tugas: t.nama_tugas,
            status: t.status,
            updated_at: t.updated_at
          })) || []
      }))
    };

    return formattedResult;
  }


  async teamProject(id: string, page?: number, page_size?: number) {
    let skip;
    if (page != null && page_size != null) {
        skip = (page - 1) * page_size;
    }
    const query = this.teamRepository.createQueryBuilder('team')
        .leftJoin('team.project', 'project')
        .addSelect('project.id' )
        .leftJoin('team.karyawan', 'karyawan')
        .addSelect('karyawan.id')
        .leftJoin('karyawan.user', 'user')
        .addSelect('user.nama')
        .leftJoin('karyawan.job', 'job')
        .addSelect('job.nama_job')
        .where('project.id = :id', { id });

    if (skip != null && page_size != null) {
        query.skip(skip).take(page_size);
    }

    const [data, count] = await query.getManyAndCount();

    return { data, count };
}


  async ubahStatusKaryawan(id: string) {
    const karyawan = await this.karyawanRepository.createQueryBuilder('karyawan')
      .innerJoin('karyawan.team', 'team')
      .innerJoin('team.project', 'project')
      .where('project.id = :id', { id })
      .getMany();
    if (karyawan.length > 0) {
      await this.karyawanRepository.save(
        karyawan.map(newStatusKaryawan => {
          newStatusKaryawan.status_project = statusProjectKaryawan.available;
          return newStatusKaryawan;
        })
      );
    }
    return { message: 'Status karyawan berhasil diperbarui' };
  }
}


