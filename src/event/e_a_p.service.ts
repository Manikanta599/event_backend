import { Injectable } from "@nestjs/common";
import { E_A_P_Repo } from "../event/Repo/e_a_p_repo";
import { E_A_P_Response } from "../event/models/e_a_p_response";
import { E_A_P_Details } from "../event/models/e_a_p_details"; 
import { E_A_P_Entity } from "../event/entity/e_a_p_entity";

@Injectable()
export class E_A_P_Service {
  constructor(private readonly eventAttendedPeopleRepo: E_A_P_Repo) {}

  async getAttendances(): Promise<E_A_P_Response> {
    try {
      const data = await this.eventAttendedPeopleRepo.find();
      const response = new E_A_P_Response();
      response.data = data.map(item => {
        const details = new E_A_P_Details();
        details.attendance_id = item.attendance_id;
        details.event_id = item.event_id;
        details.people_id = item.people_id;
        
        return details;
      });

      response.status = true;
      response.errorCode = 0;
      response.internalMessage = "Data retrieved successfully";
      return response;
    } catch (error) {
      console.error("Error fetching attendances:", error);
      const errorResponse = new E_A_P_Response();
      errorResponse.status = false;
      errorResponse.errorCode = 1;
      errorResponse.internalMessage = "Error fetching attendances";
      errorResponse.data = [];
      return errorResponse;
    }
  }

  async getAttendanceById(id: number): Promise<E_A_P_Response> {
    try {
      const data = await this.eventAttendedPeopleRepo.findOne({ where: { people_id: id } });
      const response = new E_A_P_Response();

      if (data) {
        const details = new E_A_P_Details();
        details.attendance_id = data.attendance_id;
        details.event_id = data.event_id;
        details.people_id = data.people_id;
        
        response.status = true;
        response.errorCode = 0;
        response.internalMessage = "Data fetched successfully";
        response.data = [details];
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not found";
        response.data = [];
      }

      return response;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      const errorResponse = new E_A_P_Response();
      errorResponse.status = false;
      errorResponse.errorCode = 1;
      errorResponse.internalMessage = "Error fetching attendance";
      errorResponse.data = [];
      return errorResponse;
    }
  }

  async deleteAttendanceById(id: number): Promise<E_A_P_Response> {
    try {
      const data = await this.eventAttendedPeopleRepo.findOne({ where: { attendance_id: id } });
      const response = new E_A_P_Response();

      if (data) {
        await this.eventAttendedPeopleRepo.delete({ attendance_id: id });
        response.status = true;
        response.errorCode = 0;
        response.internalMessage = "Attendance deleted successfully";
        response.data = [data];
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not found";
        response.data = [];
      }

      return response;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      const errorResponse = new E_A_P_Response();
      errorResponse.status = false;
      errorResponse.errorCode = 1;
      errorResponse.internalMessage = "Error deleting attendance";
      errorResponse.data = [];
      return errorResponse;
    }
  }

  async saveAttendance(details: E_A_P_Details): Promise<E_A_P_Response> {
    const response = new E_A_P_Response();

    try {
      const newAttendance = new E_A_P_Entity();
      newAttendance.event_id = details.event_id;
      newAttendance.people_id = details.people_id;
     

      const savedData = await this.eventAttendedPeopleRepo.save(newAttendance);
      if (savedData) {
        response.status = true;
        response.errorCode = 0;
        response.internalMessage = "Attendance saved successfully";
        response.data = [savedData];
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not saved";
        response.data = [];
      }

      return response;
    } catch (error) {
      console.error("Error saving attendance:", error);
      response.status = false;
      response.errorCode = 1;
      response.internalMessage = "Error saving attendance";
      response.data = [];
      return response;
    }
  }

  async updateAttendance(id: number, details: E_A_P_Details): Promise<E_A_P_Response> {
    const response = new E_A_P_Response();

    try {
      const existingData = await this.eventAttendedPeopleRepo.findOne({ where: { attendance_id: id } });

      if (!existingData) {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not found";
        response.data = [];
        return response;
      }

      if (details.event_id !== undefined) {
        existingData.event_id = details.event_id;
      }
      if (details.people_id !== undefined) {
        existingData.people_id = details.people_id;
      }
      

      const updatedData = await this.eventAttendedPeopleRepo.save(existingData);
      if (updatedData) {
        response.status = true;
        response.errorCode = 0;
        response.internalMessage = "Attendance updated successfully";
        response.data = [updatedData];
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not updated";
        response.data = [];
      }

      return response;
    } catch (error) {
      console.error("Error updating attendance:", error);
      response.status = false;
      response.errorCode = 1;
      response.internalMessage = "Error updating attendance";
      response.data = [];
      return response;
    }
  }


  async saveAttendances(event_id: number, people_ids: number[]): Promise<E_A_P_Response> {
    const response = new E_A_P_Response();
  
    try {
      const attendanceRecords = people_ids.map((people_id) => {
        const newAttendance = new E_A_P_Entity();
        newAttendance.event_id = event_id;
        newAttendance.people_id = people_id;
        return newAttendance;
      });
  
      const savedData = await this.eventAttendedPeopleRepo.save(attendanceRecords);
      
      if (savedData && savedData.length > 0) {
        response.status = true;
        response.errorCode = 0;
        response.internalMessage = "Attendance saved successfully";
        response.data = savedData;
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "Attendance not saved";
        response.data = [];
      }
  
      return response;
    } catch (error) {
      console.error("Error saving attendance:", error);
      response.status = false;
      response.errorCode = 1;
      response.internalMessage = "Error saving attendance";
      response.data = [];
      return response;
    }
  }


  
  async getAttendanceByEventId(eventId: number): Promise<E_A_P_Response> {
    try {
      // Fetch the list of people_id for the given event_id
      const data: E_A_P_Entity[] = await this.eventAttendedPeopleRepo
        .createQueryBuilder('eap')
        .select('eap.people_id')
        .where('eap.event_id = :eventId', { eventId })
        .getRawMany();
  
      console.log("Raw fetched data:", data);
  
      const response = new E_A_P_Response();
      response.status = true;
      response.errorCode = 0;
      response.internalMessage = "Data fetched successfully";
  
      if (data.length > 0) {
        const peopleIds = data.map(row => row.people_id);
        console.log("Extracted people_ids:", peopleIds);
  
        response.data = data; // Directly assign data to response.data
      } else {
        response.status = false;
        response.errorCode = 1;
        response.internalMessage = "No attendance records found";
        response.data = [];
      }
  
      return response;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      const errorResponse = new E_A_P_Response();
      errorResponse.status = false;
      errorResponse.errorCode = 1;
      errorResponse.internalMessage = "Error fetching attendance";
      errorResponse.data = [];
      return errorResponse;
    }
  }

  
  
}
