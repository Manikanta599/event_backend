import { DataSource, Repository } from "typeorm";
import { LoginEntity } from "../entity/loginEntity";
import { Injectable } from "@nestjs/common";



@Injectable()
export class Login_Repo extends Repository<LoginEntity>
{
    constructor(private dataSource:DataSource)
    {
        super(LoginEntity,dataSource.createEntityManager())
    }
}
