import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { UserRepository } from './repository/users.repository';
import { SopirRepository } from './repository/sopir.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import EmailService from 'src/modules/support/email/email.service';
import { jwtConfig } from 'src/config/jwt.config';
import { CreatePenumpangDto } from './dto/create-penumpang.dto';
import { string } from 'joi';
import { parse } from 'path';
import { PenumpangRepository } from './repository/penumpang.repository';
import { AdminRepository } from './repository/admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSopirDto } from './dto/create-sopir.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository) 
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly adminRepository: AdminRepository,
        private readonly sopirRepository: SopirRepository,
        private readonly penumpangRepository: PenumpangRepository
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

    async RegisterAdmin(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerAdmin(createUserDto, role);
      if(user){
        const admin = await this.adminRepository.createAdmin(user);
        return {
           status: 201,
           message: 'Success create account',
           data: {
             id: user.id,
             username: user.username,
             email: user.email,
             role: user.role
           }
         }
       }
    }

    async RegisterPenumpang(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerPenumpang(createUserDto, role)
      const sendLink = await this.sendVerificationLink(user.email, user.id);
      if(user){
       const penumpang = await this.penumpangRepository.createPenumpang(user);
       return {
          status: 201,
          message: 'Success create account',
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      }
    }

    async RegisterSopir(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerSopir(createUserDto, role)
      const sendLink = await this.sendVerificationLink(user.email, user.id);
      if(user){
       const sopir = await this.sopirRepository.createSopir(user);
       return {
          status: 201,
          message: 'Success create account',
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      }
    }

    async accountSetupAdmin(id: string, createAdmin: CreateAdminDto){
        const { NamaLengkap, Foto } = createAdmin;
        const user = await this.getUserById(id);
        user.admin.NamaLengkap = NamaLengkap;
        user.admin.Foto = Foto;

        await user.admin.save();
    }

    async accountSetupPenumpang(id: string, createPenumpang: CreatePenumpangDto){
      const { NamaLengkap, Foto } = createPenumpang;
      const user = await this.getUserById(id);
      user.penumpang.NamaLengkap = NamaLengkap;
      user.penumpang.Foto = Foto;

      await user.penumpang.save();
    }

    async accountSetupSopir(id: string, createSopir: CreateSopirDto){
      const { NamaLengkap, Foto } = createSopir;
      const user = await this.getUserById(id);
      user.sopir.NamaLengkap = NamaLengkap;
      user.sopir.Foto = Foto;

      await user.sopir.save();
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

    sendVerificationLink(email: string, id: string) {
        const url = `${process.env.EMAIL_CONFIRMATION_URL}${id}`;
    
        const text = `Selamat datang di aplikasi Angkotkita. Untuk Memverifikasi email Anda, klik link berikut: ${url}`;
    
        return this.emailService.sendMail({
          to: email,
          subject: 'Verifikasi Email',
          text,
        })
    }

    async decodeConfirmationToken(token: string) {
      try {
        const payload = await this.jwtService.verify(token, {
          secret: 'koderahasia',
        });
  
        if (typeof payload === 'object' && 'email' in payload) {
          return payload.email;
        }
        throw new BadRequestException();
      } catch (error) {
        if (error?.name === 'TokenExpiredError') {
          throw new BadRequestException('Email confirmation token expired');
        }
        throw new BadRequestException('Bad confirmation token');
      }
    }

    async confirmEmail(email: string) {
        const user = await this.getByEmail(email);
        if (user.emailVerified) {
          throw new BadRequestException('Email already confirmed');
        } else {
          const confirm = await this.EmailHasBeenConfirmed(email);
          return {
            status: 201,
            message: 'Email confirmation successfully',
          }
        }
    }

    async sendEmailForgetPasswordLink(email: string){
      const user = await this.getByEmail(email);
      if(!user){
        throw new BadRequestException('Email Tidak Ditemukan');
      } else{
        const payload = { 
          email: email 
        };
        const token = this.jwtService.sign(payload);
        const url = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
        const text = `Selamat Datang Di Aplikasi Angkotkita. Untuk Mereset Password, Silahkan Klik Link Berikut: ${url}`;

        return this.emailService.sendMail({
          to: email,
          subject: `Reset Password`,
          text,
        })
      }
    }

    async resetPassword(email: string, ResetPasswordDto): Promise<void>{
      const { password } = ResetPasswordDto;

      const user = await this.getByEmail(email);
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);

      await user.save();
    }

    hash(plainPassword){
      const salt = bcrypt.genSalt();
      const hash = bcrypt.hashSync(plainPassword, parseInt(salt))
      return hash; 
    }

    compare(plainPassword, hash){
      const valid = bcrypt.compareSync(plainPassword, hash);
      return valid;
    }

    

    
}
