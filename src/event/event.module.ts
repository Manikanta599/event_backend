import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity } from "./entity/evententity";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { EventRepo } from "./Repo/EventRepo";
import { InviteEntity } from "./entity/e_i_p_entity";
import { E_A_P_Entity } from "./entity/e_a_p_entity";
import { PeopleModule } from "src/people/people.module";
import { PeopleService } from "src/people/people.service";
import { E_I_P_Module } from "./e_i_p.module";



@Module({
    imports:[
        TypeOrmModule.forFeature([EventEntity]),
        PeopleModule,
        E_I_P_Module,
       
    ],
    
    providers:[EventService],
    controllers:[EventController],
    
    
})


export class EventModule{}