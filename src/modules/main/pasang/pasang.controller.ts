import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Pasang } from 'src/entities/pasang.entity';
import Role from 'src/entities/roles.enum';
import { UUIDValidationPipe } from 'src/modules/support/pipes/uuid-validation.pipe';
import { ThisMonthInstance } from 'twilio/lib/rest/api/v2010/account/usage/record/thisMonth';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/roles.guard';
import { GetPasang } from './get-pasang.decorator';
import { PasangService } from './pasang.service';
import { extname } from 'path';
import { createPasangDto } from './dto/create-pasang.dto';

@ApiTags('Iklan')
@Controller('pasang')
export class PasangController {
  constructor(private pasangservice: PasangService) {}

  @Get()
  getAllPasang(@GetPasang() Pasang: Pasang) {
    return this.pasangservice.getAllPasang();
  }

  @Get('/:id')
  getPasangById(@Param('id', UUIDValidationPipe) id: string): Promise<Pasang> {
    return this.pasangservice.getPasangById(id);
  }

  @Post('pasang-iklan')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  //   @UseInterceptors(
  //     FileInterceptor('foto', {
  //       storage: diskStorage({
  //         destination: './uploads/iklan',
  //         filename: (req: any, file, cb) => {
  //           const namafile = [req.user.id, Date.now()].join('-');
  //           cb(null, namafile + extname(file.originalname));
  //         },
  //       }),
  //     }),
  //   )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: createPasangDto })
  async createPasang(
    @Body() payload: createPasangDto,
    // @UploadedFile() Foto: Express.Multer.File,
    // @Request() req,
  ) {
    // payload.Foto = Foto.filename;
    // return this.pasangservice.createPasang(payload, req.user.pembeli);
    return this.pasangservice.createPasang(payload);
  }

  @Put('update-iklan/:id')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/iklan',
        filename: (req: any, file, cb) => {
          const namafile = [req.user.id, Date.now()].join('-');
          cb(null, namafile + extname(file.originalname));
        },
      }),
    }),
  )
  //   @ApiConsumes('multipart/form-data')
  //   @ApiBody({ type: UpdatePasa })
  //   async updateBerita(
  //     @Param('id', UUIDValidationPipe) id: string,
  //     @Body() payload: UpdateBeritaDto,
  //     @UploadedFile() gambar: Express.Multer.File,
  //   ): Promise<void> {
  //     if (gambar) {
  //       payload.gambar = gambar.filename;
  //     }
  //     return this.beritaService.updateBerita(id, payload);
  //   }
  @Delete('/:id')
  @UseGuards(RoleGuard(Role.Pembeli))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return null;
  }
}
