import { Role } from "#/role/entities/role.entity";

export const roleMasterData: Partial<Role>[] = [
    {
        id: '23131e76-ee28-407c-aed7-a5d573cb1cd5',
        nama: 'Super Admin',
        users:[],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,

    },
    {   
        id:'ee896f7b-91b9-4ad4-bfa2-811e4735b787',
        nama: 'Team Lead',
        users:[],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,

    },
    {   
        id:'49b88cc3-de8d-4e80-8bec-ffe8a79b1cff',
        nama: 'Karyawan',
        users:[],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,

    }
]