import { LoginDetails } from "./loginDetails";



export class LoginResponse 
{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:LoginDetails[];
   
}
