import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map, Observable } from "rxjs";
import {plainToInstance} from 'class-transformer'

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: any){

    }
    
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto,data,{
                    excludeExtraneousValues: true
                });
            }),
        );
    }

}

export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

interface ClassConstructor{
    new (...args: any[]) : {}
}