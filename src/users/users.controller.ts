import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SuperAdminUpdatePasswordDto } from './dto/super-admin-update-password.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateStatusKeaktifan } from './dto/update-status-keaktifan.dto';
/**
 * Menambah User Baru (Hanya untuk Super Admin)
 * url: http://localhost:3222/users/tambah [ok]
 * 
 * Memanggil Semua User
 * url: http://localhost:3222/users [ok]
 * 
 * Memanggil User Berdasarkan Id (untuk detail)
 * url: http://localhost:3222/users/:id/detail [ok]
 * 
 * Super Admin Update Password Team Lead atau Karyawan (Hanya untuk Super Admin)
 * url: http://localhost:3222/users/:id/super-admin-update-password [ok]
 * 
 * User Update Password nya sendiri (Semua Role)
 * url: http://localhost:3222/users/:id/update-password [ok]
 * 
 * Memanggil Semua Team Lead (Hanya untuk Super Admin)
 * url: http://localhost:3222/users/team-lead [ok]
 * 
 * Update Status Keaktifan User
 * url: http://localhost:3222/users/:id/update-status-keaktifan [ok]
 */


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Menambahkan user baru
   */
  @Post('tambah-team-lead')
  async createTeamLead(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.createTeam(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  /**
   * Memanggil semua user
   */
  @Get()
  async listUser() {
    const { data, count } = await this.usersService.findAll();
    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Memanggil user berdasarkan Id
   */
  @Get(':id/detail')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Super Admin Update Passsword User
   */
  @Put(':id/super-admin-update-password')
  async superAdminUpdatePassword(
    @Param('id') id: string,
    @Body() superAdminUpdatePasswordDto: SuperAdminUpdatePasswordDto,
  ) {
    return {
      data: await this.usersService.superAdminUpdatePassword(id, superAdminUpdatePasswordDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  /**
   * User Update Password
   */
  @Put(':id/update-password')
  async updatePasswordUser(@Param('id') id: string, @Body() updatePasswordUserDto: UpdatePasswordUserDto) {
    const data = await this.usersService.updatePasswordUser(id, updatePasswordUserDto);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Memanggil role team lead
   */
  @Get('team-lead')
  async getTeamLead() {
    return {
      data: await this.usersService.findTeamLead(),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  // @Get('karyawan')
  // async getKaryawan() {
  //   return {
  //     data: await this.usersService.findKaryawan(),
  //     statusCode: HttpStatus.OK,
  //     message: 'success',
  //   }
  // }

  /**
   * Update Status Keaktifan User
   */
  @Put(':id/update-status-keaktifan')
  async updateStatusKeaktifan(@Param('id') id:string,@Body()updateStatusKeaktifan:UpdateStatusKeaktifan){
    const data = await this.usersService.updateStatusKeaktifan(id,updateStatusKeaktifan);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
