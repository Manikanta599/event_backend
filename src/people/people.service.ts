import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PeopleEntity } from "./entity/peopleEntity";
import { Repository } from "typeorm";
import { PeopleResponse } from "./models/PeopleResponse";
import { PeopleDetails } from "./models/PeopleDetails";




@Injectable()
export class PeopleService
{
    constructor(
        @InjectRepository(PeopleEntity)
        private readonly peopleRepo:Repository<PeopleEntity>
    ){}


    async getpeoples(): Promise<PeopleResponse> {
        console.log("in people service..");
        
        try {
            const data = await this.peopleRepo.find();
            console.log(data);
    
            const peopleRes = new PeopleResponse();
            const details: PeopleDetails[] = [];
    
            for (const item of data) {
                const detailsObj = new PeopleDetails();
                detailsObj.people_id = item.people_id;
                detailsObj.f_name = item.f_name;
                detailsObj.l_name = item.l_name;
                detailsObj.email = item.email;
                detailsObj.designation = item.designation;
                detailsObj.ph_num = item.ph_num;
    
                details.push(detailsObj);
            }
    
            if (details.length > 0) {
                peopleRes.status = true;
                peopleRes.errorCode = 0;
                peopleRes.internalMessage = "Data retrieved successfully";
            } else {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "No data found";
            }
    
            peopleRes.data = details;
    
            return peopleRes;
        } catch (error) {
            console.error("Error fetching data:", error);
            return {
                status: false,
                errorCode: 1,
                internalMessage: "Error fetching data",
                data: []
            };
        }
    }


    
    async deletePersonById(id: number): Promise<PeopleResponse> {
        console.log("In delete service..");
        
        const peopleRes = new PeopleResponse();
        
        try {
            // Fetch the data to be deleted
            const dataToDelete = await this.peopleRepo.findOne({ where: { people_id: id } });
            if (!dataToDelete) { 
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not found";
                peopleRes.data = [];
                return peopleRes;
            } 
            
            // Delete the data
            const result = await this.peopleRepo.delete(id);
            console.log(result);
    
            if (result.affected > 0) {
                const detailsObj = new PeopleDetails();
                detailsObj.people_id = dataToDelete.people_id;
                detailsObj.f_name = dataToDelete.f_name;
                detailsObj.l_name = dataToDelete.l_name;
                detailsObj.email = dataToDelete.email;
                detailsObj.designation = dataToDelete.designation;
                detailsObj.ph_num = dataToDelete.ph_num;
    
                peopleRes.status = true;
                peopleRes.errorCode = 0;
                peopleRes.internalMessage = "Data deleted successfully";
                peopleRes.data = [detailsObj];
            } else {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not found";
                peopleRes.data = [];
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            peopleRes.status = false;
            peopleRes.errorCode = 1;
            peopleRes.internalMessage = "Error deleting data";
            peopleRes.data = [];
        }
    
        return peopleRes;
    }


    



    async savePerson(details: PeopleDetails): Promise<PeopleResponse> {
        console.log("In save service..");
    
        const peopleRes = new PeopleResponse();
    
        try {
            // Check if the user already exists by email
            const existingUser = await this.peopleRepo.findOne({
                where: { email: details.email }
            });
    
            if (existingUser) {
                
                peopleRes.status = false;
                peopleRes.errorCode = 1; 
                peopleRes.internalMessage = "Email already exists";
                peopleRes.data = [];
                return peopleRes;
            }
    
            // If user does not exist, proceed to save the new person
            const newPerson = new PeopleEntity();
            newPerson.f_name = details.f_name;
            newPerson.l_name = details.l_name;
            newPerson.email = details.email;
            newPerson.designation = details.designation;
            newPerson.ph_num = details.ph_num;
    
            const savedData = await this.peopleRepo.save(newPerson);
            console.log(savedData);
    
            if (savedData) {
                peopleRes.status = true;
                peopleRes.errorCode = 0;
                peopleRes.internalMessage = "Data saved successfully";
                peopleRes.data = [savedData];
            } else {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not saved";
                peopleRes.data = [];
            }
        } catch (error) {
            console.error("Error saving data:", error);
            peopleRes.status = false;
            peopleRes.errorCode = 1;
            peopleRes.internalMessage = "Error saving data";
            peopleRes.data = [];
        }
    
        return peopleRes;
    }
    





    async updatePerson(id: number, details: PeopleDetails): Promise<PeopleResponse> {
        console.log("In update service..");

        const peopleRes = new PeopleResponse();
        try {
            // Fetch the existing entity from the database
            const existingData = await this.peopleRepo.findOne({ where: { people_id: id } });

            if (!existingData) {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not found";
                peopleRes.data = null;
                return peopleRes;
            }

            // Update the existing entity with new data
            if (details.f_name !== undefined) {
                existingData.f_name = details.f_name;
            }
            if (details.l_name !== undefined) {
                existingData.l_name = details.l_name;
            }
            if (details.email !== undefined) {
                existingData.email = details.email;
            }
            if (details.designation !== undefined) {
                existingData.designation = details.designation;
            }
            if (details.ph_num !== undefined) {
                existingData.ph_num = details.ph_num;
            }

            // Save the updated entity back to the database
            const updatedData = await this.peopleRepo.save(existingData);
            console.log(updatedData);

            if (updatedData) {
                peopleRes.status = true;
                peopleRes.errorCode = 0;
                peopleRes.internalMessage = "Data updated successfully";
                peopleRes.data = [updatedData];
            } else {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not updated";
                peopleRes.data = null;
            }
        } catch (error) {
            console.error("Error updating data:", error);
            peopleRes.status = false;
            peopleRes.errorCode = 1;
            peopleRes.internalMessage = "Error updating data";
            peopleRes.data = null;
        }

        return peopleRes;
    }



    async getPersonById(id: number): Promise<PeopleResponse> {
        const peopleRes = new PeopleResponse();

        try {
            const data = await this.peopleRepo.findOne({ where: { people_id: id } });

            if (data) {
                const detailsObj = new PeopleDetails();
                detailsObj.people_id = data.people_id;
                detailsObj.f_name = data.f_name;
                detailsObj.l_name = data.l_name;
                detailsObj.email = data.email;
                detailsObj.designation = data.designation;
                detailsObj.ph_num = data.ph_num;

                peopleRes.status = true;
                peopleRes.errorCode = 0;
                peopleRes.internalMessage = "Data fetched successfully.";
                peopleRes.data = [detailsObj];
            } else {
                peopleRes.status = false;
                peopleRes.errorCode = 1;
                peopleRes.internalMessage = "Data not found.";
                peopleRes.data = [];
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            peopleRes.status = false;
            peopleRes.errorCode = 1;
            peopleRes.internalMessage = "Error fetching data.";
            peopleRes.data = [];
        }

        return peopleRes;
    }


    async  getPeopleIdsByDesignation(designation: string): Promise<number[]> {
        
    
        const people = await this.peopleRepo.createQueryBuilder('people')
            .select('people.people_id')
            .where('people.designation = :designation', { designation })
            .getMany();
    
        return people.map(person => person.people_id);
    }

    //for invites
    async getPeopleByEventId(eventId: number): Promise<PeopleResponse> {
        try {
            const result = await this.peopleRepo
                .createQueryBuilder('p')
                .leftJoin('invites', 'i', 'p.people_id = i.people_id')
                .select([
                    'p.people_id',
                    'p.f_name',
                    'p.l_name',
                    'p.email',
                    'p.designation',
                    'p.ph_num',
                ])
                .where('i.event_id = :eventId', { eventId })
                .getRawMany();
            console.log("result..", result);
    
            // Map result to PeopleDetails
            const data: PeopleDetails[] = result.map(item => ({
                people_id: item.p_people_id,
                f_name: item.p_f_name,
                l_name: item.p_l_name,
                email: item.p_email,
                designation: item.p_designation,
                ph_num: item.p_ph_num,
            }));
    
            // Create and return PeopleResponse
            const response: PeopleResponse = {
                status: true,
                errorCode: 0,
                internalMessage: 'Success',
                data,
            };
    
            return response;
    
        } catch (error) {
            console.error('Error fetching people by event ID:', error);
            return {
                status: false,
                errorCode: 1,
                internalMessage: `Failed to fetch people: ${error.message}`,
                data: [],
            };
        }
    }


    async getPeopleWhoAreAttended(event_id: number): Promise<PeopleResponse> {
        try {
          // Fetch people who attended the event
          const people = await this.peopleRepo
            .createQueryBuilder('p')
            .innerJoin('e_a_p', 'ea', 'p.people_id = ea.people_id')
            .where('ea.event_id = :event_id', { event_id })
            .getMany();
    
          // Check if any people are fetched
          if (people.length === 0) {
            return {
              status: false,
              errorCode: 1,
              internalMessage: 'No people found for the given event',
              data: [],
            };
          }
    
          // Map the people to PeopleDetails
          const peopleDetails: PeopleDetails[] = people.map(person => ({
            people_id: person.people_id,
            f_name: person.f_name,
            l_name: person.l_name,
            email: person.email,
            designation: person.designation,
            ph_num: person.ph_num,
          }));
    
          return {
            status: true,
            errorCode: 0,
            internalMessage: 'People fetched successfully',
            data: peopleDetails,
          };
        } catch (error) {
          console.error('Error fetching people:', error);
          return {
            status: false,
            errorCode: 500,
            internalMessage: 'Internal Server Error',
            data: [],
          };
        }
    }


    async getPeopleWhoDidNotAttend(event_id: number): Promise<PeopleResponse> {
        try {
            // Fetch people who did not attend the event
            const people = await this.peopleRepo
                .createQueryBuilder('p')
                .leftJoin('e_a_p', 'ea', 'p.people_id = ea.people_id AND ea.event_id = :event_id', { event_id })
                .where('ea.event_id IS NULL')
                .getMany();
    
            // Check if any people are fetched
            if (people.length === 0) {
                return {
                    status: false,
                    errorCode: 1,
                    internalMessage: 'No people found who did not attend the event',
                    data: [],
                };
            }
    
            // Map the people to PeopleDetails
            const peopleDetails: PeopleDetails[] = people.map(person => ({
                people_id: person.people_id,
                f_name: person.f_name,
                l_name: person.l_name,
                email: person.email,
                designation: person.designation,
                ph_num: person.ph_num,
            }));
    
            return {
                status: true,
                errorCode: 0,
                internalMessage: 'People who did not attend fetched successfully',
                data: peopleDetails,
            };
        } catch (error) {
            console.error('Error fetching people who did not attend:', error);
            return {
                status: false,
                errorCode: 500,
                internalMessage: 'Internal Server Error',
                data: [],
            };
        }
    }
    
    
   

    
    
    
    

}