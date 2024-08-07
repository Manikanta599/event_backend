import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'e_a_p'})
export class E_A_P_Entity {
    @PrimaryGeneratedColumn()
    attendance_id: number;
  
    @Column({name:'event_id'})
    event_id: number;
  
    @Column({name:'people_id'})
    people_id: number;

  }