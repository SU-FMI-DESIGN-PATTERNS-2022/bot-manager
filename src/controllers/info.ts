import { NextFunction, Request, Response } from 'express';
import { getSystemData } from '../services/system-load';
import { getGitTagData } from '../services/git';

export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const systemData = await getSystemData();
        const gitData = await getGitTagData();
        res.status(200).send({
            version: gitData.tag_name,
            commit: gitData.tag_commit,
            deployment: gitData.tag_branch,
            CPU: systemData.cpuLoad,
            CPU_AVG: systemData.loadAvg
        });
    } catch (err) {
        next(err);
    }
};
