import { Sopir } from "src/entities/sopir.entity";
import { User } from "src/entities/users.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Sopir)
export class SopirRepository extends Repository<Sopir>{
    async createSopir(user: User){
        const Sopir = this.create();
        Sopir.user = user;

        return await Sopir.save();
    }

}