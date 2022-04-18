import { Body, Controller, Delete, Get, Param, PayloadTooLargeException, Post, Put, Query, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { title } from 'process';
import { GetUser } from 'src/modules/main/auth/get-user.decorator';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { UsersService } from './users.service';
import RoleGuard from 'src/modules/main/auth/guard/roles.guard';  
import Role from 'src/entities/roles.enum';
import TokenDto from './dto/token.dto';
import { CreatePenumpangDto } from './dto/create-penumpang.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateSopirDto } from './dto/create-sopir.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}

    @Get()
    getAllUser(@GetUser() user: User){
        return this.usersService.getAllUser();
    }

    @Get('/:id')
    async getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User>{
        return this.usersService.getUserById(id); 
    }

    @Post('register-admin')
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtGuard)
    async RegisterAdmin(@Body() payload: CreateUserDto){
        let role = 'Admin';
        return this.usersService.RegisterAdmin(payload, role);
    }

    @Post('register-penumpang')
    async RegisterPenumpang(@Body() createUser: CreateUserDto){
        let role = 'Penumpang';
        return await this.usersService.RegisterPenumpang(createUser, role);        
    }

    @Post('register-sopir')
    async RegisterSopir(@Body() payload: CreateUserDto){
        let role = 'Sopir';
        return await this.usersService.RegisterSopir(payload, role);
    }

    @Put('account-setup-admin/:id')
    @UseGuards(JwtGuard)
    async accountSetupAdmin(@Param('id', UUIDValidationPipe) id: string, @Body() payload: CreateAdminDto,){
        return this.usersService.accountSetupAdmin(id,payload);
    }

    @Put('account-setup-penumpang/:id')
    @UseGuards(JwtGuard)
    async accountSetupPenumpang(@Param('id', UUIDValidationPipe) id: string, @Body() payload: CreatePenumpangDto,){
        return this.usersService.accountSetupPenumpang(id,payload);
    }

    @Put('account-setup-sopir/:id')
    @UseGuards(JwtGuard)
    async accountSetupSopir(@Param('id', UUIDValidationPipe) id: string, @Body() payload: CreateSopirDto,){
        return this.usersService.accountSetupSopir(id,payload);
    }

    @Put('update-customer/:id')
    @UseGuards(JwtGuard)
    async updateCustomer(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: updateUserDto,
    ): Promise<void>{
        return this.usersService.updateUser(id, payload);
    }

    @Delete('/:id')   
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtGuard)
    async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
        return this.usersService.deleteUser(id);
    }

    @Get('confirm/:id')
    async confirmEmail(@Param('id', UUIDValidationPipe) id: string) {
        const user = await this.usersService.getUserById(id);
        const userEmail = user.email;
        await this.usersService.confirmEmail(userEmail);
    }
    
}
