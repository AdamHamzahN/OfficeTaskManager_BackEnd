import { Karyawan } from "#/karyawan/entities/karyawan.entity";
import { Project } from "#/project/entities/project.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tugas {
    /**
     * id UUID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * nama_tugas varchar(100)
     */
    @Column({ type: 'varchar', length: 100 })
    nama_tugas: string;

    /**
     * deskripsi_tugas text
     */
    @Column({ type: 'text' })
    deskripsi_tugas: string;

    /**
     * note Text
     */
    @Column({ type: 'text' })
    note: string;

    /**
     * deadline Date
     */
    @Column({ type: 'date' })
    deadline: Date;

    /**
     * file_tugas text
     */
    @Column({ type: 'text' })
    file_tugas: string;

    /**
     * file_bukti text
     */
    @Column({ type: 'text' })
    file_bukti: string;

    /**
     * status enum(pending,on progress,done,approved,redo)
     */
    @Column({
        type: 'enum',
        enum: ['pending', 'on progress', 'done', 'approved', 'redo'],
        default: 'pending',
    })
    status: 'pending' | 'on progress' | 'done' | 'approved' | 'redo';

    
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
    
    //----Relasi----------------------------------------------------
    /** 
     * Relasi ke project
    */
    @ManyToOne(() => Project,project => project.id)
    @JoinColumn({ name: 'id_project' })
    project: Project;

    /**
     * Relasi ke Karyawan
     */
    @ManyToOne(() => Karyawan, karyawan => karyawan.id)
    @JoinColumn({ name: 'id_karyawan' })
    karyawan: Karyawan;

}



