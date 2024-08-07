import { PeopleResponse } from "src/people/models/PeopleResponse";
import { LoginEntity } from "./entity/loginEntity";
import { LoginService } from "./login.service";
import { Login_Repo } from "./Repo/loginRepo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { LoginResponse } from "./models/loginResponse";
import { LoginController } from "./login.controller";
import { JwtModule } from "@nestjs/jwt";





@Module({
    imports:[
        TypeOrmModule.forFeature([LoginEntity]),

        JwtModule.register({
            secret:'secret',
            signOptions:{expiresIn:'1d'},
          })

    ],
    providers:[LoginService,Login_Repo],
    controllers:[LoginController],
    
    
})

export class LoginModule{}

