// 사용자 전체 목록 조회 API
import api from '@/shared/lib/axios';

export type User = {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
    joinedAt: string;
    lastLoginAt?: string;
    participatingChallenges?: number; // 참여 중인 챌린지 수
    completedChallenges?: number; // 완료한 챌린지 수
    totalRewards?: number; // 총 획득 포상
};

export type ApiForGetUserListResponse = {
    success: boolean;
    users: User[];
    count: number;
};

export async function apiForGetUserList(): Promise<ApiForGetUserListResponse> {
    try {
        const res = await api.get('/api/users');
        return res.data;
    } catch (error) {
        console.error('사용자 목록 API 호출 실패:', error);
        throw error;
    }
}
