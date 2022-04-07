import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "src/entities/refresh-token.entity";

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

    @Column({ unique: true })
    num_phone: string;

    @Column()
    role: string;

    @Column({ default: false })
    emailVerified: boolean;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { eager: true })
    refreshToken: RefreshToken[];

    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

