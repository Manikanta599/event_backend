import { DataSource, Repository } from "typeorm";
import { EventEntity } from "../entity/evententity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventRepo extends Repository<EventEntity>
{
    constructor(private dataSource:DataSource)
    {
        super(EventEntity,dataSource.createEntityManager())
    }
}