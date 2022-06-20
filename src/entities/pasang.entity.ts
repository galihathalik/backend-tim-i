import { CONNREFUSED } from 'dns';
import { extend, string } from 'joi';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pembeli } from './pembeli.entity';

@Entity()
export class Pasang extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pembeli, (pembeli) => pembeli.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  pembeli: Pembeli;

  @Column()
  tujuan: string;

  @Column()
  tipe: string;

  @Column()
  lokasi: string;

  @Column()
  luasBangunan: string;

  @Column()
  hargaTotal: number;

  @Column()
  jumlahKamarTidur: number;

  @Column()
  jumlahKamarMandi: number;

  @Column()
  judul: string;

  @Column()
  deskripsi: string;

  @Column()
  alamatEmail: string;

  @Column()
  nomorHP: number;

  @Column()
  Foto: string;

  @CreateDateColumn()
  created_ad: Date;
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
