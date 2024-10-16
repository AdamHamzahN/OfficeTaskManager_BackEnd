import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
/**
 * Menambah Team
 * url: http://localhost:3222/team/tambah [ok]
 * 
 * Memanggil semua team
 * url: http://localhost:3222/team [ok]
 * 
 * Memanggil team berdasarkan Id
 * url: http://localhost:3222/team/:id/detail [ok]
 * 
 * Memanggil team karyawan saat ini (project yang sedang di kerjakan)
 * url: http://localhost:3222/team/:id/project-karyawan [ok]
 * 
 * History
 * url: http://localhost:3222/team/:id/history [ok]
 * 
 * Memanggil team berdasarkan project
 * url: http://localhost:3222/team/:id/team-project
 */

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post('tambah')
  async create(@Body() createTeamDto: CreateTeamDto) {
    const data = await this.teamService.create(createTeamDto);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get()
  async listTeam() {
    const team = await this.teamService.findAll();
    return {
      team,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id/detail')
  async getTeamById(@Param('id') id: string) {
    return await this.teamService.findOne(id);
  }

  @Get(':id/project-karyawan')
  async projectKaryawan(@Param('id') id: string) {
    return await this.teamService.projectKaryawan(id);

  }

  @Get(':id/history')
  async history(@Param('id') id: string) {
    try {
      return await this.teamService.history(id);
    } catch (e) {
      return { e, message: 'gagal' }
    }
  }

  @Get(':id/team-project')
  async teamProject(
    @Param('id') id: string,
  ) {
    return await this.teamService.teamProject(id);
  }
}



