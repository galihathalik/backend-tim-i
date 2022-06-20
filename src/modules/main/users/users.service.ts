import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { updateUserPembeliDto } from './dto/update-user-pembeli.dto';
import { User } from 'src/entities/users.entity';
import { UserRepository } from './repository/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import EmailService from 'src/modules/support/email/email.service';
import { jwtConfig } from 'src/config/jwt.config';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { string } from 'joi';
import { parse } from 'path';
import { PembeliRepository } from './repository/pembeli.repository';
import { AdminRepository } from './repository/admin.repository';
import { uploadDto } from './dto/upload.dto';
import { FIlterUSerDto } from './dto/fillter-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly adminRepository: AdminRepository,
    private readonly pembeliRepository: PembeliRepository,
  ) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.getAllUser();
  }

  async checkVerifiedEmail(email: string) {
    const verified = await this.userRepository.findOne({ where: { email } });

    if (verified.emailVerified) {
      return true;
    } else {
      return false;
    }
  }

  async EmailHasBeenConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        emailVerified: true,
      },
    );
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    //  else {
    //   return {
    //     status: 200,
    //     message: 'Data User berhasil ditemukan',
    //     data: {
    //       id.
    //     }
    //   }
    // }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async RegisterAdmin(createUserDto: CreateUserDto, role) {
    const user = await this.userRepository.registerAdmin(createUserDto, role);
    if (user) {
      const admin = await this.adminRepository.createAdmin(user);
      return {
        status: 201,
        message: 'Berhasil Membuat Akun',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          num_phone: user.num_phone,
        },
      };
    } else {
      return {
        status: 400,
        message: 'Gagal Membuat Akun',
        data: null,
      };
    }
  }

  async RegisterPembeli(createUserDto: CreateUserDto, role) {
    const user = await this.userRepository.registerPembeli(createUserDto, role);
    const sendLink = await this.sendVerificationLink(user.email, user.id);
    if (user) {
      const penumpang = await this.pembeliRepository.createPembeli(user);
      return {
        status: 201,
        message: 'Berhasil Membuat Akun',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          num_phone: user.num_phone,
        },
      };
    } else {
      return {
        status: 400,
        message: 'Gagal Membuat Akun',
        data: null,
      };
    }
  }

  async AturAkunAdmin(id: string, createAdmin: CreateAdminDto) {
    const { NamaLengkap, Foto } = createAdmin;
    const user = await this.getUserById(id);
    user.admin.NamaLengkap = NamaLengkap;
    user.admin.Foto = Foto;

    await user.admin.save();
  }

  async AturAkunPembeli(id: string, createPembeli: CreatePembeliDto) {
    const { NamaLengkap, Foto_Profil } = createPembeli;
    const user = await this.getUserById(id);
    user.pembeli.NamaLengkap = NamaLengkap;
    user.pembeli.Foto_Profil = Foto_Profil;

    await user.pembeli.save();
  }

  //update all use blm relasi
  async updateUser(id: string, updateUserDto: updateUserDto) {
    const { username, password, email, num_phone } = updateUserDto;
    const user = await this.getUserById(id);
    user.username = username;
    user.email = email;
    user.num_phone = num_phone;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    if (user) {
      await user.save();
      return {
        status: 200,
        message: 'Success Update Account',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } else {
      return {
        status: 400,
        message: 'Failed Update Account',
        data: null,
      };
    }
    // user.pembeli.NamaLengkap = NamaLengkap;
    // user.pembeli.Foto_Profil = Foto_Profil;
    // user.pembeli.save();
  }

  // async updatePembeli(
  //   id: string, updatePembeliDto: updateUserPembeliDto,
  // ): Promise<void> {
  //   const { email,  } =
  //     updateUserPembeliDto;
  //   const user = await this.getUserById(id);
  //   user.email = email;
  //   user.num_phone = num_phone;
  //   await user.save();

  //   user.pembeli.NamaLengkap = NamaLengkap;
  //   user.pembeli.Foto_Profil = Foto;
  //   user.pembeli.JualVerified = JualVerified;
  //   user.pembeli.save();
  // }

  async updatePembeli(id: string, updatePembeliDto: updateUserPembeliDto) {
    const { email, username, num_phone, NamaLengkap, Foto } = updatePembeliDto;
    const user = await this.getUserById(id);
    user.username = username;
    user.email = email;
    user.num_phone = num_phone;

    await user.save();

    user.pembeli.NamaLengkap = NamaLengkap;
    user.pembeli.Foto_Profil = Foto;
    user.pembeli.save();
  }

  async uploadfoto(id: string, uploadFoto: uploadDto) {}

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
  }

  async filterUsers(filter: FIlterUSerDto): Promise<User[]> {
    return await this.userRepository.filterUsers(filter);
  }

  async validateUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    return await this.userRepository.validateUser(username, email, password);
  }

  sendVerificationLink(email: string, id: string) {
    const url = `${process.env.EMAIL_CONFIRMATION_URL}${id}`;

    const text = `Selamat datang di aplikasi Ohome360. Untuk Memverifikasi email Anda, klik link berikut: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Verifikasi Email Aplikasi Ohome360',
      text,
    });
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
      throw new BadRequestException('Email sudah di konfirmasi');
    } else {
      const confirm = await this.EmailHasBeenConfirmed(email);
      return {
        status: 201,
        message: 'KOnfirmasi Email Berhasil',
      };
    }
  }

  async sendEmailForgetPasswordLink(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Email Tidak Ditemukan');
    } else {
      const payload = {
        email: email,
      };
      const token = this.jwtService.sign(payload);
      const url = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
      const text = `Selamat Datang Di Aplikasi Ohome. Untuk Mereset Password, Silahkan Klik Link Berikut: ${url}`;

      return this.emailService.sendMail({
        to: email,
        subject: `Reset Password`,
        text,
      });
    }
  }

  async resetPassword(email: string, ResetPasswordDto): Promise<void> {
    const { password } = ResetPasswordDto;

    const user = await this.getByEmail(email);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    await user.save();
  }

  async hash(plainPassword) {
    const salt = await bcrypt.genSalt();
    const hash = bcrypt.hashSync(plainPassword, parseInt(salt));
    return hash;
  }

  compare(plainPassword, hash) {
    const valid = bcrypt.compareSync(plainPassword, hash);
    return valid;
  }
}
