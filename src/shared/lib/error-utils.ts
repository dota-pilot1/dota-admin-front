import { AxiosError } from 'axios';

/**
 * 백엔드 에러 응답 형식 타입 정의
 */
export interface BackendErrorResponse {
    success: boolean;
    message: string;
    errorCode: string;
    details?: string[];
    timestamp: string;
}

/**
 * AxiosError에서 BackendErrorResponse를 추출하는 타입 가드
 */
function isBackendErrorResponse(data: unknown): data is BackendErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'success' in data &&
        typeof (data as BackendErrorResponse).success === 'boolean' &&
        'message' in data &&
        typeof (data as BackendErrorResponse).message === 'string' &&
        'errorCode' in data &&
        typeof (data as BackendErrorResponse).errorCode === 'string' &&
        'timestamp' in data &&
        typeof (data as BackendErrorResponse).timestamp === 'string'
    );
}

/**
 * API 에러 메시지를 추출하는 유틸리티 함수
 */
export function getErrorMessage(error: unknown): string {
    if (!(error instanceof AxiosError)) {
        return '알 수 없는 오류가 발생했습니다.';
    }

    // 네트워크 에러
    if (!error.response) {
        return '네트워크 연결을 확인해주세요.';
    }

    const { data, status } = error.response;

    // 새로운 백엔드 표준 ErrorResponse 형식 처리
    if (isBackendErrorResponse(data) && data.message) {
        return data.message;
    }

    // 기존 형식 호환성 유지
    if (typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error: string }).error === 'string') {
        return (data as { error: string }).error;
    }

    // Spring Boot 기본 유효성 검사 에러 처리 (fallback)
    if (typeof data === 'object' && data !== null && 'errors' in data && Array.isArray((data as { errors: unknown[] }).errors)) {
        const fieldErrors = (data as { errors: Array<{ field?: string; defaultMessage?: string; message?: string }> }).errors.map((err) =>
            `${err.field || 'unknown'}: ${err.defaultMessage || err.message || '유효성 검사 실패'}`
        ).join(', ');
        return fieldErrors;
    }

    // HTTP 상태 코드별 기본 메시지
    return getDefaultErrorMessage(status);
}

/**
 * 에러 코드를 확인하는 유틸리티 함수
 */
export function getErrorCode(error: unknown): string | null {
    if (!(error instanceof AxiosError) || !error.response || !isBackendErrorResponse(error.response.data)) {
        return null;
    }
    return error.response.data.errorCode || null;
}

/**
 * 특정 에러 코드인지 확인하는 함수
 */
export function isErrorCode(error: unknown, code: string): boolean {
    return getErrorCode(error) === code;
}

/**
 * 에러 상세 정보를 가져오는 함수
 */
export function getErrorDetails(error: unknown): string[] {
    if (!(error instanceof AxiosError) || !error.response || !isBackendErrorResponse(error.response.data)) {
        return [];
    }
    return error.response.data.details || [];
}

/**
 * 상세 에러 정보를 문자열로 변환하는 함수
 */
export function getErrorDetailsString(error: unknown): string {
    const details = getErrorDetails(error);
    return details.length > 0 ? details.join(', ') : '';
}

/**
 * 유효성 검사 에러인지 확인하는 함수
 */
export function isValidationError(error: unknown): boolean {
    return isErrorCode(error, 'VALIDATION_ERROR') || isErrorCode(error, 'VALIDATION_FAILED');
}

/**
 * 인증 에러인지 확인하는 함수
 */
export function isAuthenticationError(error: unknown): boolean {
    return isErrorCode(error, 'AUTHENTICATION_FAILED') || 
           isErrorCode(error, 'AUTHENTICATION_REQUIRED');
}

/**
 * 상세 정보가 포함된 에러 메시지 (공통 함수)
 */
export function getDetailedErrorMessage(error: unknown): string {
    const message = getErrorMessage(error);
    const details = getErrorDetailsString(error);
    
    if (isValidationError(error) && details) {
        return `${message}: ${details}`;
    }
    
    return message;
}

/**
 * 토스트 메시지용 에러 처리 (공통 함수)
 * 유효성 검사 에러인 경우 더 친화적인 메시지로 표시
 */
export function getToastErrorMessage(error: unknown): string {
    if (isValidationError(error)) {
        const details = getErrorDetailsString(error);
        if (details) {
            return `입력 정보를 확인해주세요: ${details}`;
        }
    }
    
    return getDetailedErrorMessage(error);
}

/**
 * 폼 유효성 검사 에러 메시지 (공통 함수)
 */
export function getFormValidationMessage(error: unknown): string {
    const details = getErrorDetails(error);
    
    if (details.length > 0) {
        // 여러 유효성 검사 에러를 목록으로 표시
        return details.join('\n');
    }
    
    return getErrorMessage(error);
}

/**
 * 챌린지 생성용 에러 메시지 (공통 함수 사용)
 * @deprecated 대신 getDetailedErrorMessage를 사용하세요
 */
export function getChallengeErrorMessage(error: unknown): string {
    return getDetailedErrorMessage(error);
}

/**
 * 로그인 전용 에러 메시지
 */
export function getLoginErrorMessage(error: unknown): string {
    if (!(error instanceof AxiosError)) {
        return '알 수 없는 오류가 발생했습니다.';
    }

    if (!error.response) {
        return '네트워크 연결을 확인해주세요.';
    }

    const { data, status } = error.response;

    // 백엔드 표준 ErrorResponse 처리
    if (isBackendErrorResponse(data) && data.message) {
        return data.message;
    }

    // 기존 형식 호환성
    if (typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error: string }).error === 'string') {
        return (data as { error: string }).error;
    }

    // 로그인 특화 기본 메시지
    return getLoginDefaultMessage(status);
}

/**
 * HTTP 상태 코드별 기본 에러 메시지
 */
function getDefaultErrorMessage(status: number): string {
    switch (status) {
        case 400:
            return '입력 정보를 확인해주세요.';
        case 401:
            return '인증이 필요합니다.';
        case 403:
            return '권한이 없습니다.';
        case 404:
            return '요청한 리소스를 찾을 수 없습니다.';
        case 409:
            return '데이터 충돌이 발생했습니다.';
        case 422:
            return '처리할 수 없는 요청입니다.';
        case 429:
            return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        case 500:
            return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        case 502:
            return '서버 연결에 문제가 있습니다.';
        case 503:
            return '서비스를 일시적으로 사용할 수 없습니다.';
        default:
            return `오류가 발생했습니다. (코드: ${status})`;
    }
}

/**
 * 로그인 전용 기본 에러 메시지
 */
function getLoginDefaultMessage(status: number): string {
    switch (status) {
        case 400:
            return '이메일과 비밀번호를 확인해주세요.';
        case 401:
            return '이메일 또는 비밀번호가 올바르지 않습니다.';
        case 403:
            return '계정이 비활성화되었습니다.';
        case 404:
            return '존재하지 않는 계정입니다.';
        case 429:
            return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
        case 500:
            return '로그인 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        default:
            return `로그인에 실패했습니다. (코드: ${status})`;
    }
}