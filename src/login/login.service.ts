import { Injectable, Session } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginEntity } from "./entity/loginEntity";
import { LoginDetails } from "./models/loginDetails";
import { Login_Repo } from "./Repo/loginRepo";
import { LoginResponse } from "./models/loginResponse";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';
import session from "express-session";
// import { Session } from 'express-session';




@Injectable()
export class LoginService
{
    constructor(private readonly loginRepo: Login_Repo,
      private jwtservice:JwtService,
    ) {}




    async getDetailsByEmail(
      details: LoginDetails,
    ): Promise<{ response: LoginResponse; user?: LoginDetails }> {
      try {
        const loginEntity = await this.loginRepo.findOneBy({ email: details.email });
        if (!loginEntity) {
          return {
            response: {
              status: false,
              errorCode: 404,
              internalMessage: 'User not found',
              data: [],
            },
          };
        }
  
        if (loginEntity.password !== details.password) {
          return {
            response: {
              status: false,
              errorCode: 401,
              internalMessage: 'Invalid credentials',
              data: [],
            },
          };
        }
  
        const loginDetails: LoginDetails = {
          id: loginEntity.id,
          username: loginEntity.username,
          password: loginEntity.password,
          email: loginEntity.email,
        };
  
        return {
          response: {
            status: true,
            errorCode: 0,
            internalMessage: 'User authenticated successfully',
            data: [loginDetails],
          },
          user: loginDetails, // Include user details for session storage
        };
      } catch (error) {
        console.error(`Error fetching user by email ${details.email}:`, error);
        return {
          response: {
            status: false,
            errorCode: 500,
            internalMessage: `Unable to fetch user by email ${details.email}`,
            data: [],
          },
        };
      }
    }
    

  async createUser(loginDetails: LoginDetails): Promise<LoginResponse> {
        try {
          // Map LoginDetails to LoginEntity
          const loginEntity = this.loginRepo.create({
            username: loginDetails.username,
            password: loginDetails.password,
            email: loginDetails.email,
          });
    
          // Save the new user to the database
          const savedEntity = await this.loginRepo.save(loginEntity);
    
          // Map the saved entity back to LoginDetails
          const savedDetails: LoginDetails = {
            id: savedEntity.id,
            username: savedEntity.username,
            password: savedEntity.password,
            email: savedEntity.email,
          }; 
          
          return {
            status: true,
            errorCode: 0,
            internalMessage: 'User created successfully',
            data: [savedDetails],

            
          };
        } catch (error) {
          console.error('Error creating user:', error);
          return {
            status: false,
            errorCode: 500,
            internalMessage: 'Error creating user',
            data: [],
          };
        }
      }

  
    async verifySession(session:Record<string,any>):Promise<boolean>
      {
        console.log(session);
        console.log(session.user+"userrrrrrrrrrr");
        console.log("in verification..");
        console.log({ user: session.user });
        return !!(session && session.user); 
      }  

    
     
    
    async getProfile(@Session() session: Record<string, any>): Promise<{ user: any }> {
    return { user: session.user};
  }

    
}