import { Body, Controller, Delete, Get, Param, PayloadTooLargeException, Post, Put, UseGuards } from '@nestjs/common';
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

@Controller('users')
@UseGuards(JwtGuard)
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
    async RegisterAdmin(@Body() payload: CreateUserDto): Promise<void>{
        let role = 'Admin';
        return this.usersService.RegisterAdmin(payload, role);
    }

    @Post('register-customer')
    async RegisterCustomer(@Body() payload: CreateUserDto): Promise<void>{
        let role = 'Customer';
        return this.usersService.RegisterCustomer(payload, role);
    }

    @Post('register-driver')
    async RegisterDriver(@Body() payload: CreateUserDto): Promise<void>{
        let role = 'Driver';
        return this.usersService.RegisterDriver(payload, role);
    }

    @Put('update-customer/:id')
    async updateCustomer(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: updateUserDto,
    ): Promise<void>{
        return this.usersService.updateUser(id, payload);
    }

    @Delete('/:id')
    @UseGuards(RoleGuard(Role.Admin))
    async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
        return this.usersService.deleteUser(id);
    }
    
}
