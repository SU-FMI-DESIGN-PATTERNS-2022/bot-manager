import { NextFunction, Request, Response } from 'express';


export const isAdmin = (req: Request, res: Response, next: NextFunction):void =>{
    // TODO check if the user is Admin
    next();
};
