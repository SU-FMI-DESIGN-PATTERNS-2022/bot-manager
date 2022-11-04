import HttpException from '../classes/HttpException';
import os from 'os-utils';
import { HEALTH_CHECK } from '../config/config';
import { SystemLoad } from '../interfaces/system-load';

export const getSystemData = async (): Promise<SystemLoad> => {
    const usageCPU = await new Promise<string>((resolve) => {
        os.cpuUsage((usage) => {
            resolve((usage * 100).toFixed(0));
        });
    });

    const interval = Number(HEALTH_CHECK);
    if (interval !== 5 && interval !== 1 && interval !== 15) {
        throw new HttpException(500, 'Health check interval must be either 5, 1 or 15');
    }

    const loadAvg = os.loadavg(interval).toFixed(2);

    return {
        cpuLoad: usageCPU + '%',
        loadAvg: loadAvg + '%'
    };
};
