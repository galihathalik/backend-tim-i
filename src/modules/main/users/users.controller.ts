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
    @UseGuards(JwtGuard)
    @UseGuards(RoleGuard(Role.Admin))
    async RegisterAdmin(@Body() payload: CreateUserDto): Promise<void>{
        let role = 'Admin';
        return this.usersService.RegisterAdmin(payload, role);
    }

    @Post('register-customer')
    async RegisterCustomer(@Body() createUser: CreateUserDto, @Body() createPenumpang: CreatePenumpangDto): Promise<void>{
        let role = 'Customer';
        const user = this.usersService.RegisterCustomer(createUser, createPenumpang, role);
        await this.usersService.sendVerificationLink(createUser.email);
        return user;        
    }

    @Post('register-driver')
    async RegisterDriver(@Body() payload: CreateUserDto): Promise<void>{
        let role = 'Driver';
        const user =  this.usersService.RegisterDriver(payload, role);
        await this.usersService.sendVerificationLink(payload.email);
        return user;
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

    @Post('confirm')
    async confirmEmail(@Query() confirmationData: TokenDto) {
        const email = await this.usersService.decodeConfirmationToken(confirmationData.token);
        await this.usersService.confirmEmail(email);
    }
    
}
