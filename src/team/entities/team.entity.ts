import { Karyawan } from "#/karyawan/entities/karyawan.entity";
import { Project } from "#/project/entities/project.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Team {
    /**
     * id UUID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    // --Relasi---------------------------------------------------------
    /**
     * relasi ke project
    */
    @ManyToOne(() => Project, project => project.id)
    @JoinColumn({ name: 'id_project' })
    project: Project;

    /**
     * relasi ke karyawan
     */
    @ManyToOne(() => Karyawan, karyawan => karyawan.id)
    @JoinColumn({ name: 'id_karyawan' })
    karyawan: Karyawan;

}
