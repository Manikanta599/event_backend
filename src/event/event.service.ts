import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "./entity/evententity";
import { Between, Repository } from "typeorm";
import { EventResponse } from "./models/eventresponse";
import { EventDetails } from "./models/eventdetails";
import { PeopleService } from "src/people/people.service";
import { E_I_P_Details } from "./models/e_i_p_details";
import { E_I_P_Service } from "./e_i_p.service";
import { InviteEntity } from "./entity/e_i_p_entity";
import { People_Repo } from "src/people/Repo/people_repo";
import { DateRange } from "./models/dateModel";



@Injectable()
export class EventService
{
    constructor( 
        @InjectRepository(EventEntity) 

        private readonly eventRepo:Repository<EventEntity>,
        private readonly peopleService:PeopleService,
        private readonly e_i_p_repo:E_I_P_Service, 
        private readonly peopleRepo:People_Repo, 
    ){} 

    async getInvitesCount(eventId: number): Promise<number> {
        const result = await this.eventRepo
          .createQueryBuilder('e') 
          .leftJoin('invites', 'i', 'i.event_id = e.event_id')
          .select('COUNT(i.people_id)', 'total_invited')
          .where('e.event_id = :eventId', { eventId })
          .getRawOne();
      
        return result.total_invited ? parseInt(result.total_invited, 10) : 0;
      }


    

    async getEvents(): Promise<EventResponse> {
        console.log("in event get..");
    
        try {
            // Fetch all events
            const data = await this.eventRepo.find();
            console.log(data);
    
            const eventRes = new EventResponse();
            const details: EventDetails[] = [];
    
            for (const item of data) {
                const detailsObj = new EventDetails();
                detailsObj.event_id = item.event_id;
                detailsObj.event_name = item.event_name;
                detailsObj.event_date = item.event_date;
                detailsObj.event_location = item.event_location;
                detailsObj.event_time = item.event_time;
    
                //data view
                
   
                // Fetch the total number of invited people for this event
                const totalInvitedPeople =await this.getInvitesCount(item.event_id);
                console.log("count ",totalInvitedPeople);
                detailsObj.totalInvitedPeople=totalInvitedPeople;
    
                details.push(detailsObj);
            }
    
            if (details.length > 0) {
                eventRes.status = true;
                eventRes.errorCode = 0;
                eventRes.internalMessage = "Data retrieved successfully";
            } else {
                eventRes.status = false;
                eventRes.errorCode = 1;
                eventRes.internalMessage = "No data found";
            }
            eventRes.data = details;
    
            return eventRes;
        } catch (error) {
            console.error("Error fetching data:", error);
            const errorResponse = new EventResponse();
            errorResponse.status = false;
            errorResponse.errorCode = 1;
            errorResponse.internalMessage = "Error fetching data";
            errorResponse.data = [];
            return errorResponse;
        }
    } 

    async deleteEventById(eventId: number): Promise<EventResponse> {
        console.log("Deleting event with ID:", eventId);
    
        const eventRes = new EventResponse();
        try {
            // Fetch the event to delete and associated data
            console.log("from fd",eventId);
            const eventToDelete = await this.eventRepo.findOne({ where: { event_id: eventId } });
    
            if (eventToDelete) {
                // Deleting the event and associated invites (if necessary)
                await this.eventRepo.delete({ event_id: eventId });
                console.log(eventId);
                // You may want to ensure that cascading delete is set up in the database schema
                // or delete associated invites programmatically here
    
                // Transform event entity to EventDetails response
                const eventDetails = new EventDetails();
                eventDetails.event_id = eventToDelete.event_id;
                eventDetails.event_name = eventToDelete.event_name;
                eventDetails.event_date = eventToDelete.event_date;
                eventDetails.event_time = eventToDelete.event_time;
                eventDetails.event_location = eventToDelete.event_location;
    
                // Count total invited people for the event
                //eventDetails.totalInvitedPeople = await this.e_i_p_repo.count({ where: { event_id: eventToDelete.event_id } });
                //eventDetails.totalInvitedPeople=await this.e_i_p_repo.count({where:{eventId:eventId}})
                
                eventRes.status = true;
                eventRes.errorCode = 0;
                eventRes.internalMessage = "Event deleted successfully";
                eventRes.data = [eventDetails]; 
                
                if(this.e_i_p_repo.deleteInvitesByEventId(eventId))
                {
                    console.log(eventId +"invites also deleted..");
                }
                else
                {
                    console.log(eventId +"invites Not! deleted..");
                }
                
            } else {
                eventRes.status = false;
                eventRes.errorCode = 1;
                eventRes.internalMessage = "Event not found";
                eventRes.data = []; 
            }
    
            return eventRes; 
        } catch (error) {
            console.error("Error deleting event:", error);
            eventRes.status = false;
            eventRes.errorCode = 1;
            eventRes.internalMessage = "Error deleting event";
            eventRes.data = [];
            return eventRes;
        }
    }
    


    async saveEvent(details: EventDetails): Promise<EventResponse> { 
        console.log("In save event service..."); 
        console.log(details);
        const eventRes = new EventResponse();
    
        try {
            // Create a new EventEntity object and set its properties
            const newEvent = new EventEntity();
            newEvent.event_id = details.event_id;
            newEvent.event_name = details.event_name;
            newEvent.event_date = details.event_date;
            newEvent.event_location = details.event_location;
            newEvent.event_time = details.event_time;
            const desigs=details.designations.toString()
            newEvent.designations=desigs;
            // Save the event entity to the database
            const savedData = await this.eventRepo.save(newEvent);
            console.log(savedData);
    
            if (savedData) {
                eventRes.status = true;
                eventRes.errorCode = 0;
                eventRes.internalMessage = "Event saved successfully";
    
                // Create an EventDetails object to return in the response
                const eventDetails = new EventDetails();
                eventDetails.event_id = savedData.event_id;
                eventDetails.event_name = savedData.event_name;
                eventDetails.event_date = savedData.event_date;
                eventDetails.event_time = savedData.event_time;
                eventDetails.event_location = savedData.event_location;
                eventDetails.designations=[savedData.designations];
                eventRes.data = [eventDetails];

                
                // Assuming details.designations is a comma-separated string of designations
               // Assuming details.designations is a string like 'trainee, sde1'
               console.log(typeof details.designations);
               const designationsArray = Array.from(details.designations);

            

                //console.log(eventDetails.designations); // Example: ['Trainee', 'SDE1']
                
                // Fetch people IDs by each designation and create InviteEntity objects
                for (const designation of designationsArray) { 
                    console.log(designation);
                    const people_ids = await this.peopleService.getPeopleIdsByDesignation(designation);
                    const event_id = savedData.event_id;
                
                    for (const person_id of people_ids) {
                        const detailsObj = new InviteEntity();
                        detailsObj.event_id = event_id;
                        detailsObj.people_id = person_id; // Assign people_id
                        detailsObj.invitation_status = 'done';
                        
                        // Save each InviteEntity object
                        await this.e_i_p_repo.saveInvite(detailsObj);
                    }
                }
                

            } else {
                eventRes.status = false;
                eventRes.errorCode = 1;
                eventRes.internalMessage = "Event not saved";
                eventRes.data = [];
            }
        } catch (error) {
            console.error("Error saving event:", error);
            eventRes.status = false;
            eventRes.errorCode = 1;
            eventRes.internalMessage = "Error saving event";
            eventRes.data = [];
        }
    
        return eventRes;
    }
    


    async updateEvent(id: number, details: EventDetails): Promise<EventResponse> {

        console.log("In update event service...");
    
        const eventRes = new EventResponse();
        try {
            // Fetch the existing entity from the database
            const existingData = await this.eventRepo.findOne({ where: { event_id: id } });
    
            if (!existingData) {
                eventRes.status = false; 
                eventRes.errorCode = 1;
                eventRes.internalMessage = "Event not found";
                eventRes.data = null;
                return eventRes;
            }
    
            // Update the existing entity with new data
            if (details.event_name !== undefined) {
                existingData.event_name = details.event_name;
            }
            if (details.event_date !== undefined) {
                existingData.event_date = details.event_date;
            }
            if (details.event_location !== undefined) {
                existingData.event_location = details.event_location;
            }
            if (details.event_time !== undefined) {
                existingData.event_time = details.event_time;
            }
    
            // Save the updated entity back to the database
            const updatedData = await this.eventRepo.save(existingData);
            console.log(updatedData);

            //update eip 
            
            const inviteIds=await this.e_i_p_repo.getInviteIds(updatedData.event_id);
            console.log("onvite ids ",inviteIds);
            let inviteInd=0; 

            const designations=['sde']; 
            
            for(const desing of designations)
            {
                const people_ids=await this.peopleService.getPeopleIdsByDesignation(desing);
                console.log("people_ids ",people_ids);
                for(const person_id of people_ids)
                {
                    if(inviteInd<inviteIds.length)
                    {
                        const detailsObj =new E_I_P_Details();
                        detailsObj.event_id=updatedData.event_id;
                        detailsObj.people_id=person_id; 
                        detailsObj.invitation_status='pending';

                        const inviteId=inviteIds[inviteInd];

                        await this.e_i_p_repo.updateInvite(inviteId,detailsObj);
                        inviteInd++;
                    }
                    else
                    { 
                        console.log("no invite ids to update..");
                    } 
                }

            }

                const eventdetails=new EventDetails();
                eventdetails.event_id=updatedData.event_id;
                eventdetails.event_name=updatedData.event_name;
                eventdetails.event_date=updatedData.event_date;
                eventdetails.event_location=updatedData.event_location;
                eventdetails.event_time=updatedData.event_time;
                eventdetails.totalInvitedPeople= await this.e_i_p_repo.count({where:{eventId:updatedData.event_id}});
            
            
    
            if (updatedData) {
                eventRes.status = true;
                eventRes.errorCode = 0;
                eventRes.internalMessage = "Event updated successfully";
                eventRes.data = [eventdetails];
            } else {
                eventRes.status = false;
                eventRes.errorCode = 1;
                eventRes.internalMessage = "Event not updated";
                eventRes.data = null; 
            }
        }
        catch (error) {
            console.error("Error updating event:", error);
            eventRes.status = false;
            eventRes.errorCode = 1;
            eventRes.internalMessage = "Error updating event"; 
            eventRes.data = null; 
        }

        return eventRes; 
    }


    async getEventById(id: number): Promise<EventResponse> {
        const eventRes = new EventResponse();
    
        try {
            const data = await this.eventRepo.findOne({ where: { event_id: id } });
    
            if (data) {
                const detailsObj = new EventDetails();
                detailsObj.event_id = data.event_id;
                detailsObj.event_name = data.event_name;
                detailsObj.event_date = data.event_date;
                detailsObj.event_location = data.event_location;
                detailsObj.event_time = data.event_time;
                
                eventRes.status = true;
                eventRes.errorCode = 0;
                eventRes.internalMessage = "Data fetched successfully.";
                eventRes.data = [detailsObj];
            } else {
                eventRes.status = false;
                eventRes.errorCode = 1;
                eventRes.internalMessage = "Data not found.";
                eventRes.data = [];
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            eventRes.status = false;
            eventRes.errorCode = 1;
            eventRes.internalMessage = "Error fetching data.";
            eventRes.data = [];
        }
    
        return eventRes;
    } 


   

    async getEventsByDate(dates:DateRange): Promise<EventResponse> {
        try {
          // Convert date strings from 'DD-MM-YY' to 'YYYY-MM-DD'
          //const startDate = dayjs(from, 'DD-MM-YY').format('YYYY-MM-DD');
          //const endDate = dayjs(to, 'DD-MM-YY').format('YYYY-MM-DD');
    
          // Fetch events in the date range
          const from=dates.from;
          const to=dates.to;
          console.log(from+" "+to);
          const events = await this.eventRepo.find({
            where: {
              event_date: Between(from, to),
            },
          });
    
          // Map the events to EventDetails
          const eventDetails: EventDetails[] = events.map(event => ({
            event_id: event.event_id,
            event_name: event.event_name,
            event_date: event.event_date,
            event_time: event.event_time,
            event_location: event.event_location,
            designations: event.designations.split(','), // Convert comma-separated string to array
            totalInvitedPeople: 0, // Set this value based on your logic
          }));
    
            if(events.length>0)
            {
                return {
                    status: true,
                    errorCode: 0,
                    internalMessage: 'Events fetched successfully',
                    data: eventDetails,
                  };
            }
            else
            {
                return {
                    status: false,
                    errorCode: 1,
                    internalMessage: 'Events not  found in this range',
                    data: eventDetails,
                  };
            }
        } catch (error) {
          console.error('Error fetching events:', error);
          return {
            status: false,
            errorCode: 500,
            internalMessage: 'Internal Server Error',
            data: [],
          };
        }
    }

    



    
   
}