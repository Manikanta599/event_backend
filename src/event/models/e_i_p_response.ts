import { E_I_P_Details } from "./e_i_p_details";

export class E_I_P_Response

{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:E_I_P_Details[]; 
}