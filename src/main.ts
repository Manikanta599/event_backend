import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as session from 'express-session';
// import * as passport from 'passport';
import * as cookieParser from 'cookie-parser'; 
import * as redis from 'redis';
import { strict } from 'assert';
// import { MemoryStore } from 'express-session';
// const MemoryStore = require('memorystore')(session);
import { CookieInterceptor } from './CookieInterceptors';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  //addding globally the interceptors
  app.useGlobalInterceptors(new CookieInterceptor());
  


  // Define your CORS options
  const corsOptions: CorsOptions = {
    origin: true, // Allow requests from any origin. You can specify a domain if you need more control
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Specify allowed methods
    allowedHeaders: 'Authorization,Content-Type,Accept,Origin,X-Requested-With,Cookie',

    credentials: true, // If you need to include credentials (cookies, etc.)

  };

  // Enable CORS with the specified options
  app.enableCors(corsOptions);


  app.use(
    session({
      name: 'cookie_id',//name of the cookie
      secret: 'SECRETPINN',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
        // maxAge: 24 * 60 * 60 * 1000, // 24 hours
        maxAge: 30 * 1000,
        sameSite: 'lax', // 'lax' is often a good default, but you can change it based on your needs  
      }
    })
  );

  
  

  await app.listen(3000);
}

bootstrap();
