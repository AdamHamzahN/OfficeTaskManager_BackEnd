import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }
  /**
   * Memanggil semua role
   */
  @Get()
  listRoles() {
    return this.roleService.list();
  }
  /**
   * Memanggil role berdasarkan id
   */
  @Get(':id')
  GetRoleById(@Param('id')id: string) {
    return this.roleService.getRoleById(id);
  }

}
