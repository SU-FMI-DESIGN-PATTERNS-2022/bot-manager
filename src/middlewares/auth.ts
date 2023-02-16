import { NextFunction, Request, Response } from 'express';


export const authenticate = (req: Request, res: Response, next: NextFunction): void =>{
    // TODO use authentication
    next();
};
