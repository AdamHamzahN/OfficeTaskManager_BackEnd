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
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Menambahkan user baru
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  /**
   * Memanggil semua user
   */
  @Get()
  async listUser() {
    const {data , count } = await this.usersService.findAll();
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
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Update Passsword User
   */
  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return {
      data: await this.usersService.updatePassword(id, updatePasswordDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  // @Get(':username/user')
  // async getUserByUsername(@Param('username') username:string){
  //   // return await this.usersService.getUserByUsername(username);
  //   return {
  //     data: await this.usersService.getUserByUsername(username),
  //     statusCode: HttpStatus.OK,
  //     message: 'success',
  //   };
  // }

}
