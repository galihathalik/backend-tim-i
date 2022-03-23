import { Body, Controller, Delete, Get, Param, PayloadTooLargeException, Post, Put, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { title } from 'process';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    getAllUser(@GetUser() user: User){
        return this.usersService.getAllUser();
    }

    @Get('/:id')
    async getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User>{
        return this.usersService.getUserById(id); 
    }

    @Post()
    async Register(@Body() payload: CreateUserDto): Promise<void>   {
        return this.usersService.Register(payload);
    }

    @Put('/:id')
    async updateUser(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: updateUserDto,
    ): Promise<void>{
        return this.usersService.updateUser(id, payload);
    }

    @Delete('/:id')
    async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
        return this.usersService.deleteUser(id);
    }
    
}
