import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm'


    
@Entity({name:'peoples'})
export class PeopleEntity
{
    @PrimaryGeneratedColumn()
    people_id:number;


    @Column({name:'f_name'})
    f_name:string;

    @Column({name:'l_name'})
    l_name:string;

    @Column({name:'email'})
    email:string;

    @Column({name:'designation'})
    designation:string;

    @Column({name:'ph_num'})
    ph_num:string;


}