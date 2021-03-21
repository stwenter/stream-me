import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types/MyContext'
import jwt from 'jsonwebtoken'

const APP_SECRET = process.env.SESSION_SECRET || 'aslkdfjoiq12312'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {

    try {
        const accessToken = context.req.cookies.accessToken;
        const user = jwt.verify(accessToken!, APP_SECRET) as any;
        context.res.locals.userId = user.id
        return next();
    } catch (error) {
        throw new Error(error.message);
    }

}