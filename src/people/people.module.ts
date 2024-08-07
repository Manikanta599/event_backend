import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PeopleEntity } from "./entity/peopleEntity";
import { PeopleService } from "./people.service";
import { PeopleController } from "./people.controller";
import { People_Repo } from "./Repo/people_repo";


@Module({
    imports:[
        TypeOrmModule.forFeature([PeopleEntity])

    ],
    providers:[PeopleService,People_Repo],
    controllers:[PeopleController],
    exports:[PeopleService,People_Repo],
    
})

export class PeopleModule{}