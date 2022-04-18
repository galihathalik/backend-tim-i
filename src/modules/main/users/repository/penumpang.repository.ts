import { Penumpang } from "src/entities/penumpang.entity";
import { User } from "src/entities/users.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Penumpang)
export class PenumpangRepository extends Repository<Penumpang>{
    async createPenumpang(user: User){
        const Penumpang = this.create();
        Penumpang.user = user;

        return await Penumpang.save();
    }
}