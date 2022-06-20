import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pasang } from 'src/entities/pasang.entity';
import { createPasangDto } from './dto/create-pasang.dto';
import { PasangRepository } from './repository/pasang.repository';

@Injectable()
export class PasangService {
  constructor(
    @InjectRepository(PasangRepository)
    private pasangRepository: PasangRepository,
  ) {}

  async getAllPasang(): Promise<Pasang[]> {
    return await this.pasangRepository.getAllPasang();
  }

  async getPasangById(id: string): Promise<Pasang> {
    const pasang = await this.pasangRepository.findOne(id);
    if (!pasang) {
      throw new NotFoundException(
        `Jual/Sewa Properti dengan id ${id} tidak ditemukan`,
      );
    }
    return pasang;
  }

  async createPasang(createPasangDto: createPasangDto) {
    //   async createPasang(createPasangDto: createPasangDto, @Request() req) {
    const iklan = await this.pasangRepository.createPasang(
      createPasangDto,
      //   req,
    );
    if (iklan) {
      return {
        status: 201,
        message: 'Success create Iklan',
        data: {
          type: iklan.tipe,
          lokasi: iklan.lokasi,
          luasBangunan: iklan.luasBangunan,
          hargaTotal: iklan.hargaTotal,
          jumlahKamarMandi: iklan.jumlahKamarMandi,
          jumlahKamarTidur: iklan.jumlahKamarTidur,
          judul: iklan.judul,
          deskripsi: iklan.deskripsi,
          alamatEmail: iklan.alamatEmail,
          nomorHP: iklan.nomorHP,
          //   Foto: iklan.Foto,
          //   by_pembeli: iklan.pembeli.NamaLengkap,
        },
      };
    } else {
      return {
        status: 400,
        message: 'Gagal Membuat Iklan',
        data: null,
      };
    }
  }

  //   pasang.tipe = tipe;
  //     pasang.tujuan = tujuan;
  //     pasang.lokasi = lokasi;
  //     pasang.luasBangunan = luasBangunan;
  //     pasang.hargaTotal = hargaTotal;
  //     pasang.jumlahKamarMandi = jumlahKamarMandi;
  //     pasang.jumlahKamarTidur = jumlahKamarTidur;
  //     pasang.judul = judul;
  //     pasang.deskripsi = deskripsi;
  //     pasang.alamatEmail = alamatEmail;
  //     pasang.nomorHP = nomorHP;
  //     pasang.Foto = Foto;

  // async updateBerita(id: string, UpdateBeritaDto): Promise<void>{
  //     const { judul, isi, gambar } = UpdateBeritaDto;
  //     const berita = await this.getBeritaById(id);
  //     berita.judul = judul;
  //     berita.isi = isi;
  //     berita.gambar = gambar;
  //     await berita.save();
  // }

  //   async deletePasang(id: string): Promise<void>{
  //     const result = await this.pasangRepository.delete{id};
  //     if (result.affected == 0) {
  //         throw new NotFoundException(`Iklan dengan id ${id} tidak ditemukan`);
  //     }
  //   }
}
