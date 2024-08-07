import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event/entity/evententity';
import { PeopleEntity } from './people/entity/peopleEntity';
import { InviteEntity } from './event/entity/e_i_p_entity';
import { E_A_P_Entity } from './event/entity/e_a_p_entity';
import { PeopleModule } from './people/people.module';
import { E_I_P_Module } from './event/e_i_p.module';
import { E_A_P_Module } from './event/e_a_p.module';
import { EventModule } from './event/event.module';
import { LoginModule } from './login/login.module';
import { LoginEntity } from './login/entity/loginEntity';
import { JwtModule } from '@nestjs/jwt';

@Module({  
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'EventDB',
      entities: [EventEntity,PeopleEntity,InviteEntity,E_A_P_Entity,LoginEntity], 
      synchronize: false,
      logging: false,
    }), 

    PeopleModule,
    E_I_P_Module,  
    E_A_P_Module,
    EventModule,
    LoginModule,
    // TypeOrmModule.forFeature([PeopleEntity])
    
    
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
