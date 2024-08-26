
import { User } from '#/users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('role')
export class Role {
    /**
     * id UUID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * nama varchar(255)
     */
    @Column({ type: 'varchar', length: 255 })
    nama: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    deleted_at: Date;

    //--Relasi-------------------------------------------------
    /**
     * Relasi ke user
     */
    @OneToMany(() => User, user => user.role)
    users: User[];



}
