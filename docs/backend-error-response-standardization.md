# 백엔드 에러 응답 표준화 제안

## 현재 문제점
- 로그인: `{ "error": "Invalid credentials" }`
- 유효성 검사: Spring Boot 기본 형식
- 일반 에러: 각기 다른 형식

## 제안하는 공통 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "입력 정보가 올바르지 않습니다.",
    "details": [
      {
        "field": "startDate",
        "message": "시작일은 오늘 이후여야 합니다.",
        "rejectedValue": "2025-08-23"
      }
    ]
  },
  "timestamp": "2025-08-23T05:58:17.377+09:00",
  "path": "/api/challenges"
}
```

## Spring Boot 구현 예시

### 1. 공통 에러 응답 DTO
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private boolean success = false;
    private ErrorDetail error;
    private String timestamp;
    private String path;
    
    // constructors, getters, setters
}

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorDetail {
    private String code;
    private String message;
    private List<FieldError> details;
    
    // constructors, getters, setters
}

public class FieldError {
    private String field;
    private String message;
    private Object rejectedValue;
    
    // constructors, getters, setters
}
```

### 2. 글로벌 예외 핸들러
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        List<FieldError> details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new FieldError(
                error.getField(),
                error.getDefaultMessage(),
                error.getRejectedValue()
            ))
            .collect(Collectors.toList());

        ErrorDetail errorDetail = new ErrorDetail(
            "VALIDATION_FAILED",
            "입력 정보가 올바르지 않습니다.",
            details
        );

        return new ErrorResponse(
            errorDetail,
            Instant.now().toString(),
            request.getRequestURI()
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request) {
        
        ErrorDetail errorDetail = new ErrorDetail(
            "AUTHENTICATION_FAILED",
            "이메일 또는 비밀번호가 올바르지 않습니다.",
            null
        );

        return new ErrorResponse(
            errorDetail,
            Instant.now().toString(),
            request.getRequestURI()
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(
            AccessDeniedException ex,
            HttpServletRequest request) {
        
        ErrorDetail errorDetail = new ErrorDetail(
            "ACCESS_DENIED",
            "접근 권한이 없습니다.",
            null
        );

        return new ErrorResponse(
            errorDetail,
            Instant.now().toString(),
            request.getRequestURI()
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        
        ErrorDetail errorDetail = new ErrorDetail(
            "INTERNAL_SERVER_ERROR",
            "서버 내부 오류가 발생했습니다.",
            null
        );

        return new ErrorResponse(
            errorDetail,
            Instant.now().toString(),
            request.getRequestURI()
        );
    }
}
```

### 3. 프론트엔드 에러 처리 개선
```typescript
export function getErrorMessage(error: any): string {
    if (!error.response) {
        return '네트워크 연결을 확인해주세요.';
    }

    const { data } = error.response;

    // 표준화된 에러 응답 처리
    if (data?.error) {
        // 유효성 검사 에러의 경우 details가 있으면 첫 번째 필드 에러 표시
        if (data.error.details && data.error.details.length > 0) {
            return data.error.details[0].message;
        }
        return data.error.message;
    }

    // 기존 형식 호환성 유지
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return getDefaultErrorMessage(error.response.status);
}
```

## 장점
1. **일관성**: 모든 API에서 동일한 에러 형식
2. **디버깅**: 타임스탬프, 경로 정보로 추적 용이
3. **상세 정보**: 유효성 검사 시 어떤 필드가 문제인지 명확
4. **확장성**: 새로운 에러 타입 추가 용이
5. **프론트엔드 친화적**: 클라이언트에서 처리하기 쉬움

## 결론
백엔드 에러 응답 표준화를 권장합니다. 이렇게 하면 프론트엔드에서 에러 처리가 훨씬 간단해집니다!
