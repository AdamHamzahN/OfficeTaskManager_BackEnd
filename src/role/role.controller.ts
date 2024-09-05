import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
/**
 * Memanggil semua role
 * url: http://localhost:3222/role [ok]
 * 
 * Memanggil role berdasarkan Id
 * url: http://localhost:3222/role/:id/detail [ok]
 */

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
  @Get(':id/detail')
  GetRoleById(@Param('id')id: string) {
    return this.roleService.getRoleById(id);
  }

}
