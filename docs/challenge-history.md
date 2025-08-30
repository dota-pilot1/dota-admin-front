# 챌린지 히스토리(Challenge Reward History) API 구조 및 관계

## 개념
- 챌린지 히스토리란 특정 챌린지(Challenge)에 대해 지급된 포상(Reward) 내역을 의미합니다.
- 각 포상은 챌린지에 소속되어 있으며, 참가자(Participant)와 지급자(Admin) 정보, 지급 방식, 사유, 처리 상태 등을 포함합니다.

## 주요 엔티티
- **ChallengeRewardEntity**
  - `id`: 포상 고유 ID
  - `challengeId`: 소속 챌린지 ID
  - `participantId`: 포상 대상 참가자 ID
  - `amount`: 지급 금액
  - `method`: 지급 방식 (CASH: 현금, ITEM: 아이템)
  - `reason`: 지급 사유
  - `createdAt`: 지급 시각
  - `createdBy`: 지급자(관리자) ID
  - `processed`: 처리 완료 여부
  - `processedAt`: 처리 완료 시각

## API 엔드포인트
- **챌린지별 포상 내역 조회**
  - `GET /api/challenges/{challengeId}/rewards`
  - 반환: 해당 챌린지에 지급된 모든 포상 내역 리스트
  - 응답 예시:
    ```json
    {
      "success": true,
      "rewards": [
        {
          "id": 1,
          "challengeId": 10,
          "participantId": 5,
          "amount": 100000,
          "method": "CASH",
          "reason": "기여도 우수",
          "createdAt": "2025-08-30T12:34:56",
          "createdBy": 2,
          "processed": true,
          "processedAt": "2025-08-30T13:00:00"
        }
      ],
      "count": 1,
      "timestamp": "2025-08-30T14:00:00"
    }
    ```

- **챌린지별 포상 지급**
  - `POST /api/challenges/{challengeId}/rewards`
  - 요청: 지급 대상, 금액, 방식, 사유 등
  - 응답: 지급 결과 및 생성된 포상 정보

- **특정 포상 상세 조회**
  - `GET /api/challenges/{challengeId}/rewards/{rewardId}`
  - 반환: 해당 포상 상세 정보

- **사용자별 포상 내역 조회**
  - `GET /api/rewards/my`
  - 반환: 현재 로그인 사용자의 모든 포상 내역

## 관계도
- Challenge(챌린지) 1 --- N ChallengeReward(포상)
- ChallengeReward는 Challenge에 소속, Participant(사용자)와 지급자(Admin) 정보 포함

## 포상 방법 단순화 안내
포상 방법은 2단계(현금(CASH), 아이템(ITEM))만 지원하며, 기존 POINT 등은 제거됨.

## 프론트 적용 예시
- 챌린지 상세 페이지에서 `/api/challenges/{id}/rewards` 호출하여 포상 히스토리 표시
- 포상 히스토리 메뉴 추가: `/docs/challenge-history` 경로에 본 문서 연결

---

> 문의/확장: 지급 방식, 처리 상태, 참가자 정보 등 추가 필드 필요 시 백엔드 엔티티 및 DTO 확장 가능
