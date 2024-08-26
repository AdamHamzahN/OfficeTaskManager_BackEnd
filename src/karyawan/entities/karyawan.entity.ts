import { Job } from "#/job/entities/job.entity";
import { Team } from "#/team/entities/team.entity";
import { Tugas } from "#/tugas/entities/tugas.entity";
import { User } from "#/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum gender{
    LakiLaki = 'laki-laki',
    Perempuan = 'perempuan'
} 

export enum statusProject{
    Available = 'available',
    Unavailable = 'unavailable',
}

@Entity()
export class Karyawan {
    /**
     * id UUID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    /**
     * nik varchar(20)
     */
    @Column({type:'varchar',length:20})
    nik: string;

    /**
     * status_project enum('available', 'unavailable')
     */
    @Column({
        type: 'enum',
        enum: statusProject,
        default: statusProject.Available,
    })
    status_project: statusProject;

    /**
     * gender enum('laki-laki', 'perempuan')
     */
    @Column({
        type: 'enum',
        enum: gender,
        default: gender.LakiLaki,
    })
    gender: gender;

    /**
     * alamat text
     */
    @Column({type:'text'})
    alamat: string;

    
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
      
      //--Relasi---------------------------------------------------
      /**
       * relasi ke user
       */
      @ManyToOne(()=>User,user => user.id)
      @JoinColumn({name: 'id_user'})
      user: User;
  
      /**
       * relasi ke job
       */
      @ManyToOne(()=>Job,job => job.id,{nullable:true})
      @JoinColumn({name: 'id_job'})
      job: Job;

      /**
       * Relasi ke Team
       */
      @OneToMany(()=>Team,team => team.karyawan)
      team: Team[];

      /**
       * Relasi ke Tugas
       */
      @OneToMany(()=>Tugas,tugas => tugas.karyawan)
      tugas: Tugas[];
      
}
