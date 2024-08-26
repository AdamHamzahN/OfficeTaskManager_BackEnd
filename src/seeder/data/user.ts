import { StatusKeaktifan, User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt';

const salt = uuidv4();
const saltRounds = 10;
const password = 'admin123'
const hashedPassword = bcrypt.hash(password + salt,10);
console.log('Hashed Password:', hashedPassword);


export const userMasterData: Partial<User>[] = [
  {   
    id: '23131e76-ee28-407c-aed7-a5d573cb1cd5',
    username: 'admin1',
    password: hashedPassword,   
    salt: salt,
    email: 'admin123@gmail.com',
    nama: 'sutisno jaya kusumo',
    status: StatusKeaktifan.ACTIVE,
    role: { id: '23131e76-ee28-407c-aed7-a5d573cb1cd5' } as Role,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
