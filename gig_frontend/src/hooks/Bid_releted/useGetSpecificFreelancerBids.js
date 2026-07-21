import { useQuery } from '@tanstack/react-query';
import { GetSpecificFreelancerBids } from '../../api/Bid_releted.js'

export const useGetSpecificFreelancerBids = (freelancerId) => {
    return useQuery({
        queryKey: ['AllBidsOfSpecificFreelancer', freelancerId],
        
        queryFn: async () => {
            const data = await GetSpecificFreelancerBids(freelancerId);
            console.log(data);
            return data;
        },

        enabled: !!freelancerId,
    });
};