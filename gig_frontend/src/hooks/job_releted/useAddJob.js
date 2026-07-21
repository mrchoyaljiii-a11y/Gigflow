import {Addjob} from '../../api/Job_releted_API';
import {useMutation} from '@tanstack/react-query';

export const useAddJob = () => {
    return useMutation({
        mutationFn: (jobData) => Addjob(jobData),
    });
};