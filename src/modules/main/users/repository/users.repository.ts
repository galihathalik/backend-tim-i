import { InternalServerErrorException, ConflictException, Logger } from "@nestjs/common";
import { query } from "express";
import { filter } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "src/entities/users.entity";
import * as bcrypt from 'bcrypt';
import { Duplex } from "stream";
import { CreatePenumpangDto } from "../dto/create-penumpang.dto";
import { PenumpangRepository } from "./penumpang.repository";
import { SopirRepository } from "./sopir.repository";
import { AdminRepository } from "./admin.repository";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    private readonly penumpangRepo: PenumpangRepository
    private readonly sopirRepo: SopirRepository
    private readonly adminRepo: AdminRepository

    async getAllUser(): Promise<User[]>{
        const query = this.createQueryBuilder('user');
        return await query.getMany();
    }

    async registerPenumpang(createUserDto: CreateUserDto, role) {
        const { username, password, email} = createUserDto;
        
        const user = this.create();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.email = email;
        user.role = role;

        try{
            return await user.save();
        }catch(e) {
            if(e){
                throw new ConflictException(`Email ${email} Already Used`);
            }else{
                throw new InternalServerErrorException(e);
            }      
        }
    }

    async registerSopir(createUserDto: CreateUserDto, role) {
        const { username, password, email} = createUserDto;

        const user = this.create();
        
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.email = email;
        user.role = role;

        try{
            return await user.save();
        }catch(e) {
            if(e.code = 'ER_DUB_ENTRY'){
                throw new ConflictException(`Email ${email} Is Already Used`);
            }else{
                throw new InternalServerErrorException(e);
            }      
        }
    }

    async registerAdmin(createUserDto: CreateUserDto, role) {
        const { username, password, email} = createUserDto;

        const user = this.create();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.email = email;
        user.role = role;

        try{
            return await user.save();
        }catch(e) {
            if(e.code = 'ER_DUB_ENTRY'){
                throw new ConflictException(`Email ${email} Is Already Used`);
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