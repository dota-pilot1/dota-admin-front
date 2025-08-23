/**
 * 사용자 정보 타입 (JWT 토큰에서 추출)
 */
export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  authorities: string[];
};

