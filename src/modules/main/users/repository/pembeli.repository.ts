import { Pembeli } from 'src/entities/pembeli.entity';
import { User } from 'src/entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';

// @EntityRepository(Pembeli)
// export class PembeliRepository extends Repository<Pembeli>{
//     async createPembeli(user: User){
//         const Pembeli = this.create();
//         Pembeli.user = user;

//         return await Penumpang.save();
//     }
// }

@EntityRepository(Pembeli)
export class PembeliRepository extends Repository<Pembeli> {
  async createPembeli(user: User) {
    const Pembeli = this.create();
    Pembeli.user = user;
    return await Pembeli.save();
  }
}
