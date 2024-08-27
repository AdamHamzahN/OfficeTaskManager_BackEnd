import { StatusKeaktifan, User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import * as crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt)
                     .update(password)
                     .digest('hex');
  return hash;
}
const salt = crypto.randomBytes(16).toString('hex'); 
const hashedPassword = hashPassword('admin1234', salt);

export const userMasterData: Partial<User>[] = [
  {   
    id: '23131e76-ee28-407c-aed7-a5d573cb1cd5',
    username: 'admin1',
    password: hashedPassword,  
    email: 'admin123@gmail.com',
    nama: 'sutisno jaya kusumo',
    salt:salt,
    status: StatusKeaktifan.ACTIVE,
    role: { id: '23131e76-ee28-407c-aed7-a5d573cb1cd5' } as Role,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
