import { Sopir } from "src/entities/sopir.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Sopir)
export class SopirRepository extends Repository<Sopir>{

}