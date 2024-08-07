import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { E_A_P_Response } from "./models/e_a_p_response";
import { E_A_P_Details } from "./models/e_a_p_details";
import { E_A_P_Service } from "./e_a_p.service";

@Controller('attendance')
export class E_A_P_Controller {
  constructor(private readonly eventAttendedPeopleService: E_A_P_Service) {}

  @Get('/get')
  async getAttendances(): Promise<E_A_P_Response> {
    try {
      return await this.eventAttendedPeopleService.getAttendances();
    } catch (err) {
      console.log(err)
    }
  }

  @Get(':id')
  async getAttendanceById(@Param('id') id: number): Promise<E_A_P_Response> {
    try {
      return await this.eventAttendedPeopleService.getAttendanceById(id);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Delete(':id')
  async deleteAttendanceById(@Param('id') id: number): Promise<E_A_P_Response> {
    try {
      return await this.eventAttendedPeopleService.deleteAttendanceById(id);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Post('/post')
  async saveAttendance(@Body() details: E_A_P_Details): Promise<E_A_P_Response> {
    try {
      return await this.eventAttendedPeopleService.saveAttendance(details);
    } catch (err) {
        
      console.log(err);
     
    }
  }

  @Put(':id')
  async updateAttendance(@Param('id') id: number, @Body() details: E_A_P_Details): Promise<E_A_P_Response> {
    try {
      return await this.eventAttendedPeopleService.updateAttendance(id, details);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Post('save/:id') 
async saveAttendances(@Param('id') id: number,@Body('peopleIds') peopleIds: number[]): Promise<E_A_P_Response> {
  try {
    return await this.eventAttendedPeopleService.saveAttendances(id, peopleIds);
  } catch (err) {
    console.error("Error saving attendances:", err);
   
  }
}


@Get('attended/:id')
async getAttendanceByEventId(@Param('id') id: number): Promise<E_A_P_Response> {
  try {
    return await this.eventAttendedPeopleService.getAttendanceByEventId(id);
  } catch (err) {
    console.log(err);
    
  }
}

  
}
