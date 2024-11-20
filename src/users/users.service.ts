import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { StatusKeaktifan, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '#/role/entities/role.entity';
import * as crypto from 'crypto';
import { SuperAdminUpdatePasswordDto } from './dto/super-admin-update-password.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateStatusKeaktifan } from './dto/update-status-keaktifan.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  /**
   * Function untuk hashing password
   */
  public hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    return hash;
  }
  /**
   * Membuat User Baru
   */
  async createTeamLead(createUserDto: CreateUserDto) {
    /**
     * Cek apakah username sudah ada
     */
    const checkUsername = await this.getUserByUsername(createUserDto.username);

    if (checkUsername) {
      throw new ConflictException('Username already exists');
    }

    const password = 'teamlead1234'
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(password, salt);

    createUserDto.password = hashedPassword;
    createUserDto.salt = salt;

    createUserDto.password = hashedPassword;
    if (!createUserDto.role) {
      const defaultRole = await this.roleRepository.findOne({ where: { nama: 'Team Lead' } });
      if (defaultRole) {
        createUserDto.role = defaultRole;
      } else {
        throw new Error('Default role not found');
      }
    }
    const user = await this.usersRepository.insert(createUserDto);
    return this.usersRepository.findOneOrFail({
      where: {
        id: user.identifiers[0].id,
      },
    });
  }

  /**
   * Memanggil Semua User
   * 
   */
  async findAll(page: number, page_size: number) {
    const skip = (page - 1) * page_size;
    const [data, count] = await this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .addSelect(['user', 'role.id', 'role.nama'])
      .skip(skip)
      .take(page_size)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();
    return {
      data,
      count,
    };
  }

  async getAll() {
    const [data, count] = await this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .addSelect(['user', 'role.id', 'role.nama'])
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();
    return {
      data,
      count,
    };
  }

  /**
   * Mencari User Berdasarkan ID
   * 
   */
  async findOne(id: string) {
    return await this.usersRepository.findOneOrFail({
      where: { id },
      select: ['id', 'username', 'email', 'nama', 'status'],
    });
  }

  /**
   * Fungsi untuk Super Admin untuk Update password Team Lead atau Karyawan
   * 
   */
  async superAdminUpdatePassword(id: string, newPassword: SuperAdminUpdatePasswordDto) {

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(newPassword.password, salt);

    await this.usersRepository.update(id, {
      password: hashedPassword,
      salt: salt,
    });

    return this.usersRepository.findOneOrFail({
      where: { id: id },
    });
  }
  /**
   * Cek user berdasarkan username
   */
  async getUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: ['role'],
    });
    return user;
  }

  /**
   * Fungsi Untuk User Untuk Update Password
   */
  async updatePasswordUser(id: string, updatePasswordUserDto: UpdatePasswordUserDto) {
    const { current_password, new_password, confirm_new_password } = updatePasswordUserDto;

    // Ambil user dari database berdasarkan id
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    //Ambil salt dari database
    const salt = user.salt;
    // Replace '-' salt di database
    const stringSalt = salt.replace(/-/g, '');
    // Hash password lama yang diinput oleh user
    const hashCurrentPassword = this.hashPassword(current_password, stringSalt);

    // Cek apakah password lama yang diinput sesuai
    if (user.password !== hashCurrentPassword) {
      throw new BadRequestException({
        statusCode: 404,
        message: 'Password saat ini salah, mohon masukkan password dengan benar',
      });
    }

    if (new_password.length < 6) {
      throw new BadRequestException({
        statusCode: 404,
        message: 'Password Minimal 6 Karakter',
      });
    } else if (new_password.length > 20) {
      throw new BadRequestException({
        statusCode: 404,
        message: 'Password Tidak Boleh Lebih Dari 20 Karakter',
      });
    }
    // Cek apakah konfirmasi password baru sesuai
    if (new_password !== confirm_new_password) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    // Generate salt baru dan hash password baru
    const newSalt = crypto.randomBytes(16).toString('hex');
    const hashedNewPassword = this.hashPassword(new_password, newSalt);

    // Update password dan salt di database
    await this.usersRepository.update(id, {
      password: hashedNewPassword,
      salt: newSalt,
    });

    return this.usersRepository.findOneOrFail({ where: { id } });
  }

  async findTeamLead(page: number, page_size: number) {
    const skip = (page - 1) * page_size;
    const [data, count] = await this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select([
        'user.id',
        'user.nama',
        'user.status', 
        'user.created_at', 
        'user.updated_at',
        'user.email',
        'role.nama',
      ])
      .where('role.nama = :nama', { nama: 'Team Lead' })
      .skip(skip)
      .take(page_size)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    return { data, count };
  }

  async findTeamLeadAll() {
    const [data, count] = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.nama = :nama', { nama: 'Team Lead' })
      .getManyAndCount();

    return { data, count }
  }

  async findTeamLeadActive() {
    return await this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .select(['user.id','user.nama','role.nama'])
      .where('role.nama = :nama', { nama: 'Team Lead' })
      .andWhere('status = :status', { status: StatusKeaktifan.ACTIVE })
      .getMany();
  }

  async updateStatusKeaktifan(id: string, updateStatusKeaktifan: UpdateStatusKeaktifan) {
    await this.usersRepository.update(id, updateStatusKeaktifan);
    return await this.usersRepository.findOne({ where: { id } });
  }
}
