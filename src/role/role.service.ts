import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    /**
     * Function untuk memanggil semua role
     */
    async list() {
        return await this.roleRepository.find();
    }

    /**
    * Function untuk memanggil role berdasarkan id
    */
    async getRoleById(id: string) {
        return await this.roleRepository.findOne({ where: { id } });
    }
}
