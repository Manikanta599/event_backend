import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  private isFirstTime: boolean = true; // Variable to track if it's the first time
  private validCookieIds: string[] = []; // Array to store valid cookie IDs

  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const session = request.cookies['cookie_id']; // Replace 'cookie_id' with your actual cookie name

    // Capture the cookie ID if it exists
    if (session) {
      // Store all encountered cookie IDs
      this.validCookieIds.push(session);
    }

    // If it's the first request and there's no session, allow the request to pass through
    if (this.isFirstTime && !session) {
      // Set isFirstTime to false after the first request
      this.isFirstTime = false;
      return next.handle(); 
    }

    // Validate the cookie ID against the validCookieIds array
    if (!session || !this.isValidCookieId(session)) {
      // If invalid, send a response with status 401
      response.status(401).json({ message: 'Invalid session' });
      return of(); // Ensures the request handling stops here
    }

    // If session is valid or it's not the first time, proceed with the next handler
    return next.handle();
  }

  // Method to check if the cookie ID is valid
  private isValidCookieId(cookieId: string): boolean {
    console.log(cookieId+"cookie id from the frontend");
    console.log(this.validCookieIds);
    return this.validCookieIds.includes(cookieId);
  }

  // Method to get all valid cookie IDs
  getValidCookieIds(): string[] {
    return this.validCookieIds;
  }
}
