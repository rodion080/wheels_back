import { Transaction } from 'sequelize';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
    CallHandler,
    createParamDecorator,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

const TransactionParam = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        return req.transaction;
    },
);

@Injectable()
class TransactionInterceptor implements NestInterceptor {
    constructor(
        @Inject('SEQUELIZE')
        private readonly sequelizeInstance: Sequelize,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const httpContext = context.switchToHttp();
        const req = httpContext.getRequest();
        const transaction: Transaction = await this.sequelizeInstance.transaction({
            logging: true,  // Just for debugging purposes
        });
        req.transaction = transaction;

        return next.handle().pipe(
            tap(async () => {
                await transaction.commit();
            }),
            catchError(async (err) => {
                await transaction.rollback();
                throw err;
            }),
        );
    }
}

export { TransactionParam, TransactionInterceptor };

