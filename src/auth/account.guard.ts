import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Request,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";

export function getUserByRequest(req:Request, jwtService){
    if('authorization' in req.headers){
        const authHeader = req.headers['authorization'];
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message: "User is not authorized"});
        }

        const user = jwtService.verify(token);
        return user;
    }else {
        throw new UnauthorizedException({message: "User is not authorized"});
    }

}

@Injectable()
export class AccountGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const user = getUserByRequest(req, this.jwtService);
            req.user = user;
            return user.id === Number(req.params.userId) || user.id === req.body.userId;
        } catch (e) {
            throw new HttpException("User is not authorized", HttpStatus.FORBIDDEN);
        }
    }
}