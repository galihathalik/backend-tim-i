import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/entities/users.entity";

@Entity()
export class Penumpang extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.id, {onDelete:'CASCADE'})
    @JoinColumn()
    user: User;

    @Column()
    NamaLengkap: string;

    @Column()
    Foto: string;

    @Column()
    Posisi: string;

}