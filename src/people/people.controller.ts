import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { PeopleResponse } from "./models/PeopleResponse";
import { PeopleDetails } from "./models/PeopleDetails";
import { PeopleService } from "./people.service";
// import e from "express";

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleservice: PeopleService) {}

   
    @Get('get') 
    async getPeople(): Promise<PeopleResponse> {
        try
        {
            return await this.peopleservice.getpeoples();
        }catch(err)
        {
            console.log(err);
        }
    }

    @Get(':id')
    async getPersonById(@Param('id') id:number):Promise<PeopleResponse>
    {
        try
        {
            return this.peopleservice.getPersonById(id)
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Delete(':id')
    async deletePersonById(@Param('id') id: number): Promise<PeopleResponse> {
        try
        {
            return await this.peopleservice.deletePersonById(id);
        }catch(err)
        {
            console.log(err);
        }
    }

    @Post('post')
    async savePerson(@Body() details: PeopleDetails): Promise<PeopleResponse> {
        try
        {
            return await this.peopleservice.savePerson(details);
        }
        catch(err)
        {
            console.log(err)
        }
    }

    @Put(':id')
    async updatePerson(@Param('id') id: number, @Body() details: PeopleDetails): Promise<PeopleResponse> {
        
        try
        {
            return await this.peopleservice.updatePerson(id, details);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Get('eventid/:id')
    async getPersonsByEventId(@Param('id') id:number):Promise<PeopleResponse>
    {
        try
        {
            return this.peopleservice.getPeopleByEventId(id)
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Get('peoples/:id')
    async getPeopleWhoAreAttended(@Param('id')id:number):Promise<PeopleResponse>
    {
        try
        {
            return this.peopleservice.getPeopleWhoAreAttended(id);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Get('absPeoples/:id') 
    async getPeopleWhoDidNotAttend(@Param('id')id:number):Promise<PeopleResponse>
    {
        try
        {
            return this.peopleservice.getPeopleWhoDidNotAttend(id);
        }
        catch(err)
        {
            console.log(err);
        }
    }


}
