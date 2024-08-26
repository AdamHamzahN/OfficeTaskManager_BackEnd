import { Team } from "#/team/entities/team.entity";
import { Tugas } from "#/tugas/entities/tugas.entity";
import { User } from "#/users/entities/user.entity";
import { date } from "joi";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
    /**
     * id UUID
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * nama_project varchar(100)
     */
    @Column({ type: 'varchar', length: 100 })
    nama_project: string;

    /**
     * nama_team varchar(100)
     */
    @Column({ type: 'varchar', length: 100 })
    nama_team: string;
    
    /**
     * file_project text
     */
    @Column({ type: 'text',nullable: true })
    file_project: string;

    /**
     * start_date date
     */
    @Column({ type: 'date',nullable: true })
    start_date: Date;

    /**
     * end_date date
     */
    @Column({ type: 'date' })
    end_date: Date;

    /**
     * deskripsi text
     */
    @Column({ type: 'text'})
    deskripsi: string;

    /**
     * file_hasil_project text
     */
    @Column({ type: 'text',nullable:true })
    file_hasil_project: string;

     /**
     * status enum(pending,on progress,done,approved,redo)
     */
    @Column({
        type: 'enum',
        enum: ['pending', 'on progress', 'done', 'redo', 'approved'],
        default: 'pending'
    })
    status:'pending'| 'on progress'| 'done'| 'redo'| 'approved';

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
       * Relasi ke User (sebagai team lead)
       */
      @ManyToOne(()=> User, user=>user.id)
      @JoinColumn({ name: 'id_team_lead' })
      user: User;

      /**
       * Relasi ke tugas
       */
      @OneToMany(()=> Tugas,tugas=>tugas.project)
      tugas: Tugas[];

      /**
       * Relasi ke Team
       */
      @OneToMany(()=> Team  , team=>team.project)
      team: Team[];
}
