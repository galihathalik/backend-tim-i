import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "src/auth/entity/refresh-token.entity";

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

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { eager: true })
    refreshToken: RefreshToken[];

    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

