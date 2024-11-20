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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SuperAdminUpdatePasswordDto } from './dto/super-admin-update-password.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateStatusKeaktifan } from './dto/update-status-keaktifan.dto';
import { JwtAuthGuard } from '#/auth/jwt-auth.guard';
/**
 * Menambah User Baru (Hanya untuk Super Admin)
 * url: http://localhost:3222/users/tambah-team-lead [ok]
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

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Menambahkan user baru
   */
  @Post('tambah-team-lead')
  async createTeamLead(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.createTeamLead(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Memanggil semua user
   */
  @Get()
  async listUser(@Query('page') page: number, @Query('page_size') page_size: number) {
    let data = [];
    let count = 0;
    if (page && page_size) {
      const result = await this.usersService.findAll(page, page_size);
      data = result.data;
      count = result.count;
    } else {
      const result = await this.usersService.getAll();
      data = result.data;
      count = result.count;
    }
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
    try {
      await this.usersService.superAdminUpdatePassword(id, superAdminUpdatePasswordDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * User Update Password
   */
  @Put(':id/update-password')
  async updatePasswordUser(@Param('id') id: string, @Body() updatePasswordUserDto: UpdatePasswordUserDto) {
    try {
      await this.usersService.updatePasswordUser(id, updatePasswordUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Memanggil role team lead
   */
  @Get('team-lead')
  async getTeamLead(@Query('page') page: number, @Query('page_size') page_size: number) {
    let data = [];
    let count = 0;
    if (page && page_size) {
      const result = await this.usersService.findTeamLead(page, page_size);
      data = result.data;
      count = result.count;
    } else {
      const result = await this.usersService.findTeamLeadAll();
      data = result.data;
      count = result.count;
    }
    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success'
    }
  }

  @Get('team-lead/active')
  async getTeamLeadActive() {
    return await this.usersService.findTeamLeadActive();
  }

  /**
   * Update Status Keaktifan User
   */
  @Put(':id/update-status-keaktifan')
  async updateStatusKeaktifan(@Param('id') id: string, @Body() updateStatusKeaktifan: UpdateStatusKeaktifan) {
    try {
      await this.usersService.updateStatusKeaktifan(id, updateStatusKeaktifan);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }
}
