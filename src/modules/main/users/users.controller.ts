import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  PayloadTooLargeException,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { get } from 'http';
import { title } from 'process';
import { GetUser } from 'src/modules/main/auth/get-user.decorator';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import RoleGuard from 'src/modules/main/auth/guard/roles.guard';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { updateUserPembeliDto } from './dto/update-user-pembeli.dto';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';
import Role from 'src/entities/roles.enum';
import TokenDto from './dto/token.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HighriskSpecialPrefixInstance } from 'twilio/lib/rest/voice/v1/dialingPermissions/country/highriskSpecialPrefix';
import { Helper } from 'src/shared/helper';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUser(@GetUser() user: User) {
    return this.usersService.getAllUser();
  }

  @Get('/:id')
  async getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post('register-admin')
  @ApiBearerAuth()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async RegisterAdmin(@Body() payload: CreateUserDto) {
    let role = 'Admin';
    return this.usersService.RegisterAdmin(payload, role);
  }

  @Post('register-pembeli')
  async RegisterPembeli(@Body() createUser: CreateUserDto) {
    let role = 'Pembeli';
    return await this.usersService.RegisterPembeli(createUser, role);
  }

  @Put('atur-akun-admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async accountSetupAdmin(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: CreateAdminDto,
  ) {
    return this.usersService.AturAkunAdmin(id, payload);
  }

  @Put('atur-akun-pembeli/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  async accountSetupPembeli(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: CreatePembeliDto,
  ) {
    return this.usersService.AturAkunPembeli(id, payload);
  }

  @Post('upload-foto-pembeli')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'FotoProfil',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: Helper.customFileName,
        }),
        limits: {
          fileSize: 5000000, // 5mb
        },
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  // @ApiBody(type:UploadedFile)
  uploadFile(@UploadedFile() files): string {
    return 'File upload successfully';
  }

  @Put('update-user/:id')
  @UseGuards(JwtGuard)
  async updateUser(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: updateUserDto,
  ) {
    return this.usersService.updateUser(id, payload);
  }

  @Put('update-pembeli/:id')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtGuard)
  async updatePembeli(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: updateUserPembeliDto,
  ): Promise<void> {
    return this.usersService.updatePembeli(id, payload);
    // return this.usersService.updateUser(id, payload);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get('confirm/:id')
  async confirmEmail(@Param('id', UUIDValidationPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    const userEmail = user.email;
    await this.usersService.confirmEmail(userEmail);
  }
}
