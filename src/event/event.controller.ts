import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventResponse } from "./models/eventresponse";
import { time } from "console";
import { EventDetails } from "./models/eventdetails";
import { DateRange } from "./models/dateModel";





@Controller('event')
export class EventController{
    constructor(private readonly eventservice:EventService){}


    @Get('get')
    async getEvent():Promise<EventResponse>
    {
        try
        {
            return await this.eventservice.getEvents();
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Get(':id')
    async getEventById(@Param('id') id:number):Promise<EventResponse>
    {
        try
        {
            return await this.eventservice.getEventById(id);
        }
        catch(err)
        {
            console.log(err)
        }
    }

    @Delete(':id')
    async deleteEventById(@Param('id') id:number):Promise<EventResponse>
    {
        try
        {
            return await this.eventservice.deleteEventById(id);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Post('post')
    async saveEvent(@Body() details:EventDetails):Promise<EventResponse>
    {
        try
        {
            return await this.eventservice.saveEvent(details);
        }catch(err)
        {
            console.log(err);
        }
    }

    @Put(':id')
    async updateEvent(@Param('id') id:number,@Body() details:EventDetails):Promise<EventResponse>
    {
        try
        {
            return await this.eventservice.updateEvent(id,details);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    @Post('getByDate')
    async getEventsByDate(@Body() dateRange: DateRange): Promise<EventResponse> {
        const { from, to } = dateRange;
        return this.eventservice.getEventsByDate(dateRange);
    }
}