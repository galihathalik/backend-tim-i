import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { User } from 'src/entities/users.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { GetUser } from './get-user.decorator';
import { LoginResponse } from './interface/login-response.interface';

@Controller('auth')
export class AuthController { 
    constructor(private readonly authService: AuthService){}

    @Post('login-admin')
    async loginAdmin(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginAdmin(LoginDto);
    }

    @Post('login-customer')
    async loginCustomer(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginCustomer(LoginDto);
    }

    @Post('login-driver')
    async loginDriver(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginDriver(LoginDto);
    }

    @Post('refresh-token')
    async refrestToken(@Body() refreshTokenDto: refreshAccessTokenDto): Promise<{ access_token: string }>{
        return this.authService.refreshAccessToken(refreshTokenDto);
    }

    @Patch('/:id/revoke')
    @UseGuards(JwtGuard)
    async revokeRefreshToken(@Param('id') id: string): Promise<void>{
        return this.authService.revokeRefreshToken(id);
    }
}
