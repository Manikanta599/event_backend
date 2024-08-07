import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'LoginDetails'})
export class LoginEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'username'}) 
  username: string;

  @Column({name:'password'})
  password: string;

  @Column({ unique: true ,name:'email'})
  email: string;
}
