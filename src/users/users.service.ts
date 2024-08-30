import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '#/role/entities/role.entity';
import * as crypto from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  public hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    return hash;
  }
  /**
   * Membuat User Baru
   */
  async create(createUserDto: CreateUserDto) {
    /**
     * Cek apakah username sudah ada
     */
    const checkUsername = this.getUserByUsername(createUserDto.username);
    if(checkUsername ){
      throw new ConflictException('Username already exists');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(createUserDto.password, salt);

    createUserDto.password = hashedPassword;
    createUserDto.salt = salt;

    createUserDto.password = hashedPassword;
    if (!createUserDto.role) {
      const defaultRole = await this.roleRepository.findOne({ where: { id: '49b88cc3-de8d-4e80-8bec-ffe8a79b1cff' } });
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
  async findAll() {
    const [data , count] = await this.usersRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role').getManyAndCount();
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
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  /**
   * Update password user
   * 
   */
  async updatePassword(id: string, newPassword: UpdatePasswordDto) {
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
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: ['role'],
    });
    return user;
  }
}




