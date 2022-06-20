import { EntityRepository, Repository } from 'typeorm';
import { Pasang } from 'src/entities/pasang.entity';
import { createPasangDto } from '../dto/create-pasang.dto';
import { InternalServerErrorException, Request } from '@nestjs/common';

@EntityRepository(Pasang)
export class PasangRepository extends Repository<Pasang> {
  async getAllPasang(): Promise<Pasang[]> {
    const query = this.createQueryBuilder('pasang');
    return await query.getMany();
  }

  async createPasang(
    createPasangDto: createPasangDto,
    // @Request() req,
  ): Promise<Pasang> {
    const {
      tujuan,
      tipe,
      lokasi,
      luasBangunan,
      hargaTotal,
      jumlahKamarMandi,
      jumlahKamarTidur,
      judul,
      deskripsi,
      alamatEmail,
      nomorHP,
     
    } = createPasangDto;

    const pasang = this.create();
    // pasang.pembeli = req;
    pasang.tipe = tipe;
    pasang.tujuan = tujuan;
    pasang.lokasi = lokasi;
    pasang.luasBangunan = luasBangunan;
    pasang.hargaTotal = hargaTotal;
    pasang.jumlahKamarMandi = jumlahKamarMandi;
    pasang.jumlahKamarTidur = jumlahKamarTidur;
    pasang.judul = judul;
    pasang.deskripsi = deskripsi;
    pasang.alamatEmail = alamatEmail;
    pasang.nomorHP = nomorHP;
    // pasang.Foto = Foto;

    try {
      return await pasang.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
///tujuan /jual-sewa
// tipe/rumah-ruko
// lokasi
// luas bangunan
// harga total
// jumlah kamar tidur
// jumlah kamar mandi
// judul
// deskripsi
// alamat email
// nomor hp
// upload foto
