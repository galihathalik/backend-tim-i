import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { UserRepository } from './repository/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository) 
        private readonly userRepository: UserRepository
    ) {}
     
    async getAllUser(): Promise<User[]>{
        return await this.userRepository.getAllUser();
    }

    async checkVerifiedEmail(email: string) {
        const verified = await this.userRepository.findOne({ where: { email } });
    
        if (verified.emailVerified) {
          return true;
        } else {
          return false
        }
      }

    async EmailHasBeenConfirmed(email: string) {
        return this.userRepository.update({ email }, {
            emailVerified: true
        });
    }

    async getByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
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

    async RegisterAdmin(createUserDto: CreateUserDto, role): Promise<void>{
        return await this.userRepository.register(createUserDto, role);
    }

    async RegisterCustomer(createUserDto: CreateUserDto, role): Promise<void>{
        return await this.userRepository.register(createUserDto, role);
    }

    async RegisterDriver(createUserDto: CreateUserDto, role): Promise<void>{
        return await this.userRepository.register(createUserDto, role);
    }

    async updateUser(id: string, updateUserDto): Promise<void>{
        const { username, password, email, num_phone } = updateUserDto;
        const user = await this.getUserById(id);
        user.username = username;
        user.salt = await bcrypt.getSalt();
        user.password = await bcrypt.hash(password, user.salt);
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

    async validateUser(username: string, email: string, password: string): Promise<User>{
        return await this.userRepository.validateUser(username, email, password);
    }
}
