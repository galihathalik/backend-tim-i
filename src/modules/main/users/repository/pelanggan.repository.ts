import { Penumpang } from "src/entities/penumpang.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Penumpang)
export class PenumpangRepository extends Repository<Penumpang>{

}