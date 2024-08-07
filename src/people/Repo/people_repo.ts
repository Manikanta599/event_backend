import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PeopleEntity } from "../entity/peopleEntity";
@Injectable()
export class People_Repo extends Repository<PeopleEntity>
{
    constructor(private dataSource:DataSource)
    {
        super(PeopleEntity,dataSource.createEntityManager())
    }
}