import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { promisify } from "util";
import { UsersService } from "./users.service";
import {randomBytes, scrypt as _scrypt} from 'crypto'


const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService{

    constructor(private userService: UsersService){

    }

    async signUp(email:string,password:string){
        //see if email is in use
        const users = await this.userService.findByEmail(email);
        if(users.length){
            throw new BadRequestException('email in use');
        }

        //Hash password
        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password,salt,32) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        //create a new user and save it
        return  await this.userService.create(email,result);
    }

    async signIn(email:string,password:string){
        const [user] = await this.userService.findByEmail(email);
        if(!user){
            throw new NotFoundException('user not found')
        }

        const [salt,storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt,32)) as Buffer

        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Forbidden user')
        }

        return user;
    }
}