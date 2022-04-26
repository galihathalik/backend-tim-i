import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "src/entities/refresh-token.entity";
import { Penumpang } from "src/entities/penumpang.entity";
import { Sopir } from "src/entities/sopir.entity";
import { Admin } from "src/entities/admin.entity";
import { string } from "joi";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({ unique: true })
    email: string;

    @Column()
    num_phone: string;

    @Column()
    role: string;

    @Column({ default: false })
    emailVerified: boolean;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn() 
    update_at: Date;

    @OneToOne(() => Penumpang, (penumpang) => penumpang.user, {onDelete:'CASCADE', eager:true})
    penumpang: Penumpang;

    @OneToOne(() => Sopir, (sopir) => sopir.user, {onDelete:'CASCADE', eager: true})
    sopir: Sopir;

    @OneToOne(() => Admin, (admin) => admin.user, {onDelete:'CASCADE', eager: true})
    admin: Admin;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {onDelete:'CASCADE', eager: true })
    refreshToken: RefreshToken[];

    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

