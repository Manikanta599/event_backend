import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InviteEntity } from "../entity/e_i_p_entity";

@Injectable()
export class E_I_P_Repo extends Repository<InviteEntity>
{
    constructor(private dataSource:DataSource)
    {
        super(InviteEntity,dataSource.createEntityManager())
    }
}