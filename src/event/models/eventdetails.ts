import { PeopleDetails } from "src/people/models/PeopleDetails";

export class EventDetails
{
    event_id:number;
    event_name:string;
    event_date:string;
    event_time:string;
    event_location:string;
    designations:string[];

    totalInvitedPeople: number; 

   
} 