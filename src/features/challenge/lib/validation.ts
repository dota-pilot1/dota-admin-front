import { z } from 'zod';

// 챌린지 생성 스키마 정의
export const createChallengeSchema = z.object({
  title: z
    .string()
    .min(1, '제목은 필수입니다')
    .max(255, '제목은 255자를 초과할 수 없습니다'),
  
  description: z
    .string()
    .min(1, '설명은 필수입니다')
    .max(1000, '설명은 1000자를 초과할 수 없습니다'),
  
  tags: z
    .array(z.string())
    .min(1, '최소 1개의 태그를 입력해주세요')
    .max(10, '태그는 최대 10개까지 입력할 수 있습니다'),
  
  rewardAmount: z
    .number()
    .min(0, '보상 금액은 0 이상이어야 합니다')
    .optional(),
  
  rewardType: z
    .enum(['CASH', 'POINT', 'ITEM'])
    .optional(),
  
  startDate: z
    .string()
    .min(1, '시작일은 필수입니다')
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(date) >= today;
    }, '시작일은 오늘 이후여야 합니다'),
  
  endDate: z
    .string()
    .min(1, '종료일은 필수입니다'),
}).refine((data) => {
  // 종료일이 시작일보다 늦은지 검증
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: '종료일은 시작일보다 늦어야 합니다',
  path: ['endDate'], // 에러를 endDate 필드에 표시
}).refine((data) => {
  // 보상 금액이 있으면 타입도 필수
  if (data.rewardAmount && data.rewardAmount > 0) {
    return !!data.rewardType;
  }
  return true;
}, {
  message: '보상 금액이 설정된 경우 보상 타입을 선택해주세요',
  path: ['rewardType'],
});

export type CreateChallengeForm = z.infer<typeof createChallengeSchema>;
