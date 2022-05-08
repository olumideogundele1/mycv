import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query,Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorators';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(private userService: UsersService,private authservice: AuthService){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto,@Session() session: any){
        const user =  await this.authservice.signUp(body.email,body.password);
        session.userId = user.id
        return user

    }

    // @Get('/get-current-user')
    // getCurrentUser(@Session() session: any){
    //     // return this.userService.findOne(session.userId);
    // }

    @Get('/get-current-user')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() user: User){
        // return this.userService.findOne(session.userId);
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }



    @Post('/signin')
    async signin(@Body() body: CreateUserDto,@Session() session: any){
        const user = await this.authservice.signIn(body.email,body.password);
        session.userId = user.id

        return user;
    }

    @Get('/id')
    @Serialize(UserDto)
    async findUser(@Param('id') id: string){
        const user = await this.userService.findOne(parseInt(id))
        if(!user)
            throw new NotFoundException('user not found');
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.findByEmail(email);
    }

    @Delete('/id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id),body);
    }
}
