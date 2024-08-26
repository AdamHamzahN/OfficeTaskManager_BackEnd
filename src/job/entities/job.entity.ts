import { Karyawan } from "#/karyawan/entities/karyawan.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Job {
  /**
   * id UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * nama_job varchar(100)
   */
  @Column({ type: 'varchar', length: 100 })
  nama_job: string;

  /**
   * deskripsi_job text
   */
  @Column({ type: 'text' })
  deskripsi_job: string;

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
  
  //--Relasi--------------------------------------------
  /**
   * relasi ke karyawan
   */
  @OneToMany(() => Karyawan, karyawan => karyawan.job)
  karyawan: Karyawan[];
}
