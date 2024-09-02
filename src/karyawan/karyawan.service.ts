import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Karyawan } from './entities/karyawan.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from '#/users/entities/user.entity';
import * as crypto from 'crypto';
import { Role } from '#/role/entities/role.entity';
import { Job } from '#/job/entities/job.entity';
import { EditJobDto } from './dto/edit-job-karyawan.dto';
import { UpdateStatusKaryawan } from './dto/update-status.dto';
import { UsersService } from '#/users/users.service';


@Injectable()
export class KaryawanService {
  constructor(
    @InjectRepository(Karyawan)
    private karyawanRepository: Repository<Karyawan>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    private userService: UsersService,

  ) { }
  /**
   * Membuat Karyawan baru beserta User baru
   */
  async createKaryawan(createKaryawanDto: CreateKaryawanDto): Promise<Karyawan> {
    const { username, password, email, nama, nik, gender, job } = createKaryawanDto;
    const checkUsername = await this.userService.getUserByUsername(createKaryawanDto.username);
    if (checkUsername) {
      throw new ConflictException('Username already exists');
    }
    //Membuat User Baru
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.userService.hashPassword(password, salt);

    const user = new User();
    user.username = username;
    user.password = passwordHash;
    user.nama = nama;
    user.salt = salt;
    user.email = email;
    user.role = await this.roleRepository.findOne({ where: { nama: 'karyawan' } });
    user.salt = salt;

    const savedUser = await this.userRepository.save(user);

    //Membuat Karyawan berdasarkan User yang baru dibuat
    const karyawan = new Karyawan();
    karyawan.nik = nik;
    karyawan.gender = gender;
    karyawan.user = savedUser;
    karyawan.job = job;

    return this.karyawanRepository.save(karyawan);
  }

  /**
   * Menampilkan data semua Karyawan
   */
  async findAll() {
    const [result, count] = await this.karyawanRepository.createQueryBuilder('karyawan')
      .leftJoinAndSelect('karyawan.user', 'user')
      .leftJoinAndSelect('karyawan.job', 'job')
      .getManyAndCount();
    return {
      result,
      count,
    };
  }

  /**
   * Mengambil data karyawan berdasarkan Id (untuk detail karyawan)
   */
  async findOne(id: string): Promise<Karyawan> {
    try {
      const karyawan = await this.karyawanRepository.createQueryBuilder('karyawan')
        .leftJoinAndSelect('karyawan.user', 'user')
        .leftJoinAndSelect('karyawan.job', 'job')
        .where('karyawan.id = :id', { id })
        .getOne();

      if (!karyawan) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return karyawan;
    } catch (e) {
      throw e;
    }
  }
  /**
   * Update Job Karyawan
   */
  async updateJob(id: string, editJobDto: EditJobDto): Promise<Karyawan> {
    const karyawan = await this.karyawanRepository.findOneBy({ id });
    const job = await this.jobRepository.findOneBy({ id: editJobDto.job });
    karyawan.job = job;
    return this.karyawanRepository.save(karyawan);
  }

  /**
   * Update Profile Karyawan
   */
  async updateProfile(id: string, updateKaryawanDto: UpdateKaryawanDto) {
    const { email, alamat } = updateKaryawanDto;
    const karyawan = await this.karyawanRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (email) {
      karyawan.user.email = email;
    }

    if (alamat) {
      karyawan.alamat = alamat;
    }

    await this.karyawanRepository.save(karyawan);
    return karyawan;
  }

  /**
     * Update Status Project (available / unavailable)
     */
  async updateStatusProject(id: string, updateStatus: UpdateStatusKaryawan) {
    await this.karyawanRepository.update({ id }, updateStatus);
    return await this.karyawanRepository.findOne({ where: { id } });
  }
}

