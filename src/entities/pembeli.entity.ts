import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/users.entity';

@Entity()
export class Pembeli extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  NamaLengkap: string;

  @Column({ default: false })
  JualVerified: boolean;

  @Column()
  paket: string;

  @Column()
  Foto_Profil: string;

  @Column()
  Path_Foto_Profil: string;
}
