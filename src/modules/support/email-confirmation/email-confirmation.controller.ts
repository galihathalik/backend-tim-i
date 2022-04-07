import {
    Controller,
    ClassSerializerInterceptor,
    UseInterceptors,
    Body,
    Get,
  } from '@nestjs/common';
  import ConfirmEmailDto from './confirm-email.dto';
  import { EmailConfirmationService } from './email-Confirmation.service';
  import RequestWithUser from 'src/modules/main/auth/interface/requestWithUser.interface';
  
  @Controller('email-confirmation')
  @UseInterceptors(ClassSerializerInterceptor)
  export class EmailConfirmationController {
    constructor(
      private readonly emailConfirmationService: EmailConfirmationService
    ) { }
  
    @Get('confirm')
    async confirmEmail(@Body() confirmationData: ConfirmEmailDto) {
      const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
      await this.emailConfirmationService.confirmEmail(email);
    }
  
  }