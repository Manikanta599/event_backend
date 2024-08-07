import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'events'})
export class EventEntity
{
    @PrimaryGeneratedColumn({name:'event_id'})
    event_id:number;

    @Column({name:'event_name'})
    event_name:string;  

    @Column({name:'event_date'})
    event_date:string;

    @Column({name:'event_time'})
    event_time:string; 
  
    @Column({name:'event_location'})
    event_location:string;

    @Column({name:'designations'})
    designations:string;

}