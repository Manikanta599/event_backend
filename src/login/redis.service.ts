import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoginDetails } from './models/loginDetails';
import { SessionData } from 'express-session';

interface CustomSession extends SessionData {
  user: any; // or define the exact type based on your user model
}


@Injectable()
export class SessionService {
  constructor() {}

  setSession(req: Request & { session: CustomSession }, user: LoginDetails) {
    req.session.user = user;
    console.log('User set in session:', req.session.user);
  }

  getSession(req: Request & { session: CustomSession }): any {
    return req.session.user;
  }

  destroySession(req: Request & { session: CustomSession }): void {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }

  async getAllSessionIds(req: Request & { session: CustomSession }): Promise<string[]> {
    return new Promise((resolve, reject) => {
      (req.session as any).store.all((err: any, sessions: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const sessionIds = Object.keys(sessions);
          resolve(sessionIds);
        }
      });
    });
  }
  
}
