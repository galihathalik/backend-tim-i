import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { query } from "express";
import { filter } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "src/entities/users.entity";
import * as bcrypt from 'bcrypt';
import { Duplex } from "stream";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async getAllUser(): Promise<User[]>{
        const query = this.createQueryBuilder('user');
        return await query.getMany();
    }

    async register(createUserDto: CreateUserDto, role): Promise<void> {
        const { username, password, email, num_phone} = createUserDto;

        const user = this.create();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.email = email;
        user.num_phone = num_phone;
        user.role = role;

        try{
            await user.save();
        }catch(e) {
            if(e.code = 'ER_DUB_ENTRY'){
                throw new ConflictException(`Email/Number Phone ${email}${num_phone} Already Used`);
            }else{
                throw new InternalServerErrorException(e);
            }      
        }
    }

    async validateUser(username: string, email: string, password: string): Promise<User>{
        const userEmail = await this.findOne({ email });
        const userUsername = await this.findOne({ username });
        if(userEmail && (await userEmail.validatePassword(password))){
            return userEmail;
        }

        if(userUsername && (await userUsername.validatePassword(password))){
            return userUsername;
        }
        return null;
    }
}