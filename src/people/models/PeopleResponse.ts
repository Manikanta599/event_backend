import { PeopleDetails } from "./PeopleDetails";


export class PeopleResponse
{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:PeopleDetails[];
}
