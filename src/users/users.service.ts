import { Injectable,NotFoundException } from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm'
import { User } from './users.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>){
        
    }

    create(email: string, password:string){
        const user = this.repo.create({email,password});

        return this.repo.save(user);
    }

    findOne(id:number){
        if(!id)
            throw new NotFoundException('User not allowed');
        return this.repo.findOne(id);
    }

    findByEmail(email: string){
        return this.repo.find({email:email});
    }

    async update(id: number, attrs:Partial<User>){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('user not found');
        }

        Object.assign(user,attrs);
        return this.repo.save(user);
    }

    async remove(id: number){

        try{
            return this.repo.remove(await this.findOne(id))

        }catch(err){
            console.log(err.message)
            throw new NotFoundException("IUnable to delete user");
        }

    }
}
