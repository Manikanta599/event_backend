import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResponse } from './models/loginResponse';
import { LoginDetails } from './models/loginDetails';
import { Request, Response } from 'express';
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // Prune expired entries every 24h
});

  var ids:string[]=[];

  var cookiesids:string[]=[];

@Controller('login')
export class LoginController {
  private sessionStore: any;

  constructor(private readonly loginService: LoginService) {
    
  }

  @Post('check')
  async login(
    @Body() details: LoginDetails,
    @Session() session: Record<string, any>,
    @Req() req: Request
  ): Promise<{ response: LoginResponse }> {
    try {
      // const sessionIds = await this.getAllSessionIds();
      // console.log('Session IDs:', sessionIds); // Print session IDs
      //console.log(req);

      // Find the user by email and authenticate
      const { response, user } = await this.loginService.getDetailsByEmail(details);

      if (response.status) {
        // Store user details in session
        session.user = user;
      //  console.log(session);
        // console.log("session setted ",req.session);
        console.log('User set in session:', session.user);
        // console.log('Session JSON:', JSON.stringify(session, null, 2));
        
        // Print cookies
        // console.log('Cookies:', req.cookies);
        // console.log('Session ID:', session.id); // Logs the session ID
        ids.push(session.id+"from login");
        // Optionally, print a specific cookie
        const cookieId = req.cookies['cookie_id']
        console.log('cookie_id:', cookieId);
        cookiesids.push(cookieId+" from login");

        console.log("session ids ",this.getAllSessionIds()); 

      }

      return { response };
    } catch (error) {
      console.error('Login error:', error);
      return {
        response: {
          status: false,
          errorCode: 500,
          internalMessage: 'Internal server error',
          data: [],
        },
      };
    }
  }

  @Post('post')
  async createUser(@Body() details: LoginDetails): Promise<LoginResponse> {
    try {
      return await this.loginService.createUser(details);
    } catch (err) {
      console.error(err);
      return {
        status: false,
        errorCode: 500,
        internalMessage: 'An error occurred while creating the user',
        data: [],
      };
    }
  }

  
  @Get('verify')
  async verifySession(
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      // console.log("requestttttttttttttttttttt",req)
      // console.log(req.rawHeaders);
      // Access the cookie ID from the request cookies
      const cookieId = req.cookies['cookie_id'];
      console.log('Cookie ID:', cookieId);
      cookiesids.push(cookieId+"fromverify");
      console.log("cookies from ront end ",req.cookies);

      // Logging session details for debugging
      console.log('Session:', session);
      console.log('Session ID:', session.id);
      ids.push(session.id+"from verify");
      console.log('Inside the controller...');
      this.getAllSessionIds();
      //  Verify the session using your login service
      const isValid = await this.loginService.verifySession(session);
      // const isValid=check(ids,session.id);
      console.log(isValid+"from checkkkkkkkkkkkkkkkkkkkk");
      console.log(session); // Debug session content

      return res.status(200).json({ isValid });
    } catch (error) {
      console.error('Verification error:', error);
      return res.status(500).json({ isValid: false });
    }
  }


  @Post('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('cookie_id'); // clear cookie if needed
      console.log(res.clearCookie('cookie_id'));
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  }


  getAllSessionIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      sessionStore.all((err: any, sessions: { [key: string]: any }) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const sessionIds = Object.keys(sessions);
          console.log('Session IDs:', sessionIds);
          console.log("session ids array......",ids);
          console.log("cookie ids ",cookiesids);

          resolve(sessionIds);
        }
      });
    });
  }


  

  
}
function check(cookiesids: string[], cookieId: string): boolean {
  console.log("inside the checkkkkkkkkkkkkkkk");
  console.log(cookieId+"cookieeeeeeeeeeeeeeeeeeeeeeee id");
  for (const id of cookiesids) {
    if (id === cookieId) {
      console.log("yes");
      return true;
    }
  }
  return false;
}


