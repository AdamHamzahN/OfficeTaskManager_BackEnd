import { Karyawan } from '#/karyawan/entities/karyawan.entity';
import { Project } from '#/project/entities/project.entity';
import { Role } from '#/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt';

/**
 * Enum untuk status
 */
export enum StatusKeaktifan {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}


@Entity()
export class User {
  /**
   * Id UUID 
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * username Varchar(100)
   */
  @Column({ type: 'varchar', length: 100 })
  username: string;

  /**
   * password text
   */
  @Column({ type: 'text' })
  password: string;

  /**
   * salt uuid
   */
  @Column({ type: 'uuid' })
  salt: string;


  /**
   * email Text
   */
  @Column({ type: 'text' })
  email: string;

  /**
   * nama Varchar(200)
   */
  @Column({ type: 'varchar', length: 200 })
  nama: string;

  /**
   * status enum('active', 'inactive')
   */
  @Column({
    type: 'enum',
    enum: StatusKeaktifan,
    default: StatusKeaktifan.ACTIVE,
  })
  status: StatusKeaktifan;


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
   * Relasi ke role 
   */
  @ManyToOne(() => Role, role => role.id, { nullable: true })
  @JoinColumn({ name: 'id_role' })
  role: Role;

  /**
   * Relasi ke karyawan
   */
  @OneToMany(() => Karyawan, karyawan => karyawan.user)
  karyawan: Karyawan[];

  /**
   * Relasi ke Project
   */
  @OneToMany(() => Project, project => project.user)
  project: Project[];

  //----Trigger-------------------
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.salt) {
      // Generate UUID as salt only if salt is not set
      this.salt = uuidv4();
    }
    // Hash password with UUID salt
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
