import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InviteEntity } from "./entity/e_i_p_entity";
import { E_I_P_Service } from "./e_i_p.service";
import { E_I_P_Controller } from "./e_i_p.controller";
import { E_I_P_Repo } from "./Repo/e_i_p_repo";

@Module({
    imports:[
        TypeOrmModule.forFeature([E_I_P_Repo])

    ],
    providers:[E_I_P_Service,E_I_P_Repo],
    controllers:[E_I_P_Controller],
    exports:[E_I_P_Service],
})

export class E_I_P_Module{}