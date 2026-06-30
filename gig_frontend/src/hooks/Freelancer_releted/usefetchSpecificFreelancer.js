import { fetchSpecificFreelancer } from '../../api/Freelancer_releted';
import { useQuery } from '@tanstack/react-query';

export const usefetchSpecificFreelancer = (freelancerid) => {
    return useQuery({
        queryKey: ['freelancer', freelancerid],
        queryFn: () => fetchSpecificFreelancer(freelancerid),
    });
}