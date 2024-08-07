import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { E_A_P_Entity } from "./entity/e_a_p_entity";
import { E_A_P_Controller } from "./e_a_p.controller";
import { E_A_P_Repo } from "./Repo/e_a_p_repo";
import { E_A_P_Service } from "./e_a_p.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([E_A_P_Entity])
    ],
    providers:[E_A_P_Service,E_A_P_Repo],
    controllers:[E_A_P_Controller,],
})

export class E_A_P_Module{};