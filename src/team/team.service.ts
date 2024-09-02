import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';
import { Project } from '#/project/entities/project.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Karyawan)
    private karyawanRepository: Repository<Karyawan>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { id_karyawan, id_project } = createTeamDto;
    // Check Karyawan
    const karyawanExists = await this.karyawanRepository.findOneBy({ id: id_karyawan.id });
    if (!karyawanExists) {
        throw new NotFoundException(`Karyawan with ID ${id_karyawan.id} not found`);
    }
    // Check Project
    const projectExists = await this.projectRepository.findOneBy({ id: id_project.id });
    if (!projectExists) {
        throw new NotFoundException(`Project with ID ${id_project.id} not found`);
    }
    // Buat Team Baru
    const newTeam = this.teamRepository.create({
        karyawan: karyawanExists,
        project: projectExists
    });
    return this.teamRepository.save(newTeam);
}

  async findAll() {
    const [data, count] = await this.teamRepository.createQueryBuilder('team')
    .leftJoinAndSelect('team.karyawan', 'karyawan')
    .leftJoinAndSelect('team.project','project')
    .getManyAndCount();
  return {
    data,
    count,
  };
  }

  async findOne(id: string) {
    const team = await this.teamRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.karyawan', 'karyawan')
      .leftJoinAndSelect('team.project','project')
      .where('team.id = :id', { id })
      .getOne();

    return team;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
