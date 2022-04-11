import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { query } from "express";
import { filter } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "src/entities/users.entity";
import * as bcrypt from 'bcrypt';
import { Duplex } from "stream";
import { CreatePenumpangDto } from "../dto/create-penumpang.dto";
import { PenumpangRepository } from "./pelanggan.repository";
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

    async registerPenumpang(createUserDto: CreateUserDto, createPenumpang: CreatePenumpangDto ,role): Promise<void> {
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

    async registerSopir(createUserDto: CreateUserDto, role): Promise<void> {
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

    async registerAdmin(createUserDto: CreateUserDto, role): Promise<void> {
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