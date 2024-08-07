import { EventEntity } from 'src/event/entity/evententity';
import { PeopleEntity } from 'src/people/entity/peopleEntity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('invites')
export class InviteEntity { 
  
  @PrimaryGeneratedColumn()
  invite_id: number; 

  @Column({name:'event_id'})
  event_id: number;

  @Column({name:'people_id'})
  people_id: number;

  // @Column({name:'designation'})
  // designation: string;

  @Column({name:'invitation_status'}) 
  invitation_status: string;  
  
}
