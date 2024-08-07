import { E_A_P_Entity } from "../entity/e_a_p_entity";


export class E_A_P_Response
{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:E_A_P_Entity[];
}