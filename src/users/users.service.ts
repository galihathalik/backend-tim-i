import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from './entity/users.entity';
import { UserRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository) 
        private readonly userRepository: UserRepository
    ) {}
     
    async getAllUser(): Promise<User[]>{
        return await this.userRepository.getAllUser();
    }

    async getUserById(id: string): Promise<User>{
        const user = await this.userRepository.findOne(id);
        if(!user){
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    
    async findUserById(id: string): Promise<User>{
        return await this.userRepository.findOne(id);
    }

    async Register(createUserDto: CreateUserDto): Promise<void>{
        return await this.userRepository.register(createUserDto);
    }

    async updateUser(id: string, updateUserDto): Promise<void>{
        const { username, password, email, num_phone } = updateUserDto;
        const user = await this.getUserById(id);
        user.username = username;
        user.password = password;
        user.email = email;
        user.num_phone = num_phone;

        await user.save();
    }

    async deleteUser(id: string): Promise<void>{
        const result = await this.userRepository.delete(id);
        if (result.affected == 0){
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

    async validateUser(email: string, password: string): Promise<User>{
        return await this.userRepository.validateUser(email, password);
    }
}
