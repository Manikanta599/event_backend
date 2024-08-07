import { DataSource, Repository } from "typeorm";
import { E_A_P_Entity } from "../entity/e_a_p_entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class E_A_P_Repo extends Repository<E_A_P_Entity>
{
    constructor(private dataSource:DataSource)
    {
        super(E_A_P_Entity,dataSource.createEntityManager())
    }
}