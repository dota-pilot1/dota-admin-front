# 🏆 두타 어드민 결제 프로세스 메뉴얼

## 📋 개요
`src/app/challenge/page.tsx`에서 구현된 챌린지 포상 결제 시스템의 전체 프로세스를 설명합니다.

---

## 🔧 기술 스택
- **결제 게이트웨이**: PortOne v2 SDK
- **인증**: JWT Bearer Token
- **상태 관리**: React Query + Local Storage
- **UI**: Sonner Toast, Next.js Router

---

## 🌟 핵심 컴포넌트

### 1. **환경 설정**
```typescript
const STORE_ID = "store-8859c392-62e5-4fe5-92d3-11c686e9b2bc";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-943d5d92-0688-4619-ac6e-7116f665abc0";
const SKIP_BACKEND = process.env.NEXT_PUBLIC_SKIP_BACKEND === "1";
```

### 2. **타입 정의**
```typescript
type PortOneRequest = {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: string;
    payMethod: string;
    easyPay?: { provider?: string };
    customer?: { fullName?: string; email?: string };
};

type PortOneSuccess = {
    paymentId: string;
    orderName?: string;
    approvedAt?: string;
    amount?: { total?: number; currency?: string };
    method?: string;
    easyPay?: { provider?: string };
    code?: undefined; // 성공시에는 code가 없음
};

type PortOneError = { 
    code: string; 
    message: string 
};
```

---

## 🔄 결제 프로세스 단계

### **1단계: 결제 초기화**
```typescript
const handlePay = useCallback(async (amountPerPerson: number, recipients: Participant[] = []) => {
    // 유효성 검사
    if (typeof window === "undefined") return;
    if (!selected) return;
    if (!Array.isArray(recipients) || recipients.length === 0) return;
```

### **2단계: PortOne SDK 확인**
```typescript
const PortOne: PortOneSDK | undefined = (window as unknown as { PortOne?: PortOneSDK }).PortOne;
if (!PortOne?.requestPayment) {
    // SDK 로드 실패시 리턴
    return;
}
```

### **3단계: 결제 요청 생성**
```typescript
const paymentId = `pay_${Date.now()}_${r.id}`;
const res = await PortOne.requestPayment({
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY,
    paymentId,
    orderName: `${selected.title} 포상 (${r.name})`,
    totalAmount: amountPerPerson,
    currency: "KRW",
    payMethod: "EASY_PAY",
    easyPay: { provider: "KAKAOPAY" },
    customer: r.name ? { fullName: r.name, email: r.email } : undefined,
});
```

### **4단계: 결제 결과 처리**
```typescript
// PortOne v2: 성공시 code 필드 없음, 실패시 code 필드 있음
const isSuccess = !!res && !("code" in res);

if (isSuccess) {
    // 성공 처리
} else {
    // 실패 처리
    const msg = (res as PortOneError).message || "알 수 없는 오류";
    toast.error(`결제 실패(${r.name}): ${msg}`);
}
```

### **5단계: 백엔드 API 호출** (결제 성공시)
```typescript
if (!SKIP_BACKEND) {
    // 1. 결제 기록 저장
    await recordPayment({
        paymentId,
        orderName: `${selected.title} 포상 (${r.name})`,
        amount: amountPerPerson,
        currency: "KRW",
        status: "PAID",
        method: "EASY_PAY",
        provider: "KAKAOPAY",
        payerName: r.name,
        payerEmail: r.email,
        paidAt: new Date().toISOString(),
        challengeId: selected.id,
        participantId: r.id,
        raw: res as PortOneResult,
    });
    
    // 2. 포상 처리
    await issueReward({ 
        challengeId: selected.id, 
        participantId: r.id, 
        amount: amountPerPerson 
    });
}
```

### **6단계: 로컬 상태 업데이트**
```typescript
// 챌린지 달성 카운트 증가
setItems(prev => prev.map(c => 
    c.id === selected.id 
        ? { ...c, achievedCount: (c.achievedCount ?? 0) + 1 } 
        : c
));

// 성공 메시지
toast.success(`${r.name}에게 ${amountPerPerson.toLocaleString()}원 포상 완료`);
```

### **7단계: 로컬 캐시 저장**
```typescript
const recordLocalPayment = (r: Participant, id: string, status = "PAID") => {
    const key = "paymentsCache";
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const item = {
        id,
        orderName: `${selected.title} 포상 (${r.name})`,
        amount: amountPerPerson,
        currency: "KRW",
        status,
        method: "EASY_PAY",
        provider: "KAKAOPAY",
        payerName: r.name,
        payerEmail: r.email,
        paidAt: new Date().toISOString(),
    };
    arr.unshift(item);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 100)));
    return item;
};
```

### **8단계: 페이지 이동**
```typescript
// React Query 캐시 업데이트
queryClient.setQueryData<PaymentItem[]>(["payments", "list"], (old) => {
    const prev = Array.isArray(old) ? old : [];
    return [...created, ...prev];
});

// 결제 내역 페이지로 이동
router.push("/payments");
```

---

## 🚨 에러 처리

### **백엔드 에러 허용**
```typescript
try {
    await recordPayment({...});
} catch (persistErr: unknown) {
    // 백엔드 실패해도 사용자에게는 성공으로 처리
    console.warn("[Payments][Persist][Warn]", msg);
}
```

### **결제 게이트웨이 에러**
```typescript
if (!isSuccess) {
    const msg = (res as PortOneError).message || "알 수 없는 오류";
    toast.error(`결제 실패(${r.name}): ${msg}`);
    break; // 다음 참여자 처리 중단
}
```

---

## 🔧 설정 및 환경변수

### **필수 환경변수**
```env
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-943d5d92-0688-4619-ac6e-7116f665abc0
NEXT_PUBLIC_SKIP_BACKEND=1  # 개발시에만
```

### **개발 모드 디버깅**
```typescript
if (process.env.NODE_ENV !== "production") {
    console.log("[PortOne][Request]", requestData);
    console.log("[PortOne][Result]", response);
    console.log("[Reward][Success]", rewardData);
}
```

---

## 📊 현재 제한사항

1. **단일 참여자**: 한 번에 한 명만 결제 (UX 고려)
2. **결제 수단**: KAKAOPAY EASY_PAY만 지원
3. **통화**: KRW 고정
4. **백엔드 의존성**: 백엔드 없어도 동작 (로컬 캐시)

---

## 🚀 향후 개선 계획

### **코드 분리**
1. **커스텀 훅**: `usePayment()`, `useReward()`
2. **API 계층**: 결제 로직을 별도 서비스로
3. **타입 정의**: 별도 파일로 분리

### **기능 확장**
1. **다중 결제**: 여러 참여자 동시 포상
2. **결제 수단**: 카드, 계좌이체 등 추가
3. **환불**: 잘못된 결제 취소 기능
4. **알림**: 실시간 결제 알림

---

## 📞 문의사항

결제 프로세스 관련 문의는 개발팀으로 연락해주세요.

- **Frontend**: React + PortOne v2 SDK
- **Backend**: Express + PortOne Webhook
- **Database**: MySQL payments/rewards 테이블
