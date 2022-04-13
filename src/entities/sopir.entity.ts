import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";

@Entity()
export class Sopir extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.id)
    @JoinColumn()
    user: User;

    @Column()
    NamaLengkap: string;

    @Column()
    Foto: string;

    @Column({ default: "offline" })
    Status: string;

    @Column()
    Posisi: string;

}