import { EventDetails } from "./eventdetails";


export class EventResponse
{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:EventDetails[];
}