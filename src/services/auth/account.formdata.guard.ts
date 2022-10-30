import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
// import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import * as multer from 'multer';
// import { IncomingMessage } from "http";
import { objectClone } from "../../utils";
import * as _ from 'lodash';

async function getId(r){
    const {body} = await new Promise((resolve, reject) => {
                    multer().any()(r, {}, function(err) {
                        if (err) reject(err);
                        resolve(r);
                    });
                });
    return Number(body.userId);
}

@Injectable()
export class AccountFormdataGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext)
      // :
      // boolean | Promise<boolean> | Observable<boolean>
    {
        try {
            const req = context.getClass();
            return true;
            // const reqClone = _.clone(req);
            // const authHeader = req.headers.authorization;
            // const bearer = authHeader.split(' ')[0];
            // const token = authHeader.split(' ')[1];

            // if (bearer !== 'Bearer' || !token) {
            //     throw new UnauthorizedException({message: "User is not authorized"});
            // }
            // const user = this.jwtService.verify(token);
            // // const iid = await getId(req);
            // req = reqClone;
            // return user.id === 1;
            // // return user.id === iid;
        } catch (e) {
            throw new HttpException("User is not authorized", HttpStatus.FORBIDDEN);
        }
    }
}
