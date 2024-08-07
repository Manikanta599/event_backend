import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { E_I_P_Service } from "./e_i_p.service";

import { E_I_P_Response } from "./models/e_i_p_response";

import { E_I_P_Details } from "./models/e_i_p_details";

@Controller('invites')
export class E_I_P_Controller {
  constructor(private readonly eventInvitedPeopleService: E_I_P_Service) {}

  @Get()
  async getInvites(): Promise<E_I_P_Response> {
    try {
      return await this.eventInvitedPeopleService.getInvites();
    } catch (err) {
      console.log(err);
      
    }
  }

  @Get(':id')
  async getInviteById(@Param('id') id: number): Promise<E_I_P_Response> {
    try {
      return await this.eventInvitedPeopleService.getInviteById(id);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Delete(':id')
  async deleteInviteById(@Param('id') id: number): Promise<E_I_P_Response> {
    try {
      return await this.eventInvitedPeopleService.deleteInviteById(id);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Post('post')
  async saveInvite(@Body() details: E_I_P_Details): Promise<E_I_P_Response> {
    try {
      return await this.eventInvitedPeopleService.saveInvite(details);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Put(':id')
  async updateInvite(@Param('id') id: number, @Body() details: E_I_P_Details): Promise<E_I_P_Response> {
    try {
      return await this.eventInvitedPeopleService.updateInvite(id, details);
    } catch (err) {
      console.log(err);
      
    }
  }

  @Delete('deleteID/:id')
  
  async deleteInvites(@Param('id') id: number, @Body('peopleIds') peopleIds: number[]): Promise<E_I_P_Response> {
    try {
      // Call the service method to delete invites
      const response = await this.eventInvitedPeopleService.deleteInvites(id, peopleIds);
      return response;
    } catch (err) {
      console.error('Error in deleteInvites controller:', err);
    }
  }
      


}
