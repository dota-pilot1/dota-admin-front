import { useQuery } from '@tanstack/react-query';
import { apiForGetUserList } from '../api/getUserList';

export function useApiForGetUserList() {
    return useQuery({
        queryKey: ['users'],
        queryFn: apiForGetUserList,
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
        retry: 1,
        refetchOnWindowFocus: false,
    });
}
