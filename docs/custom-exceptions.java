// 리소스를 찾을 수 없을 때
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceType, Object id) {
        super(String.format("%s를 찾을 수 없습니다. (ID: %s)", resourceType, id));
    }
}

// 중복 리소스 생성 시도 시
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String resourceType, String field, Object value) {
        super(String.format("이미 존재하는 %s입니다. (%s: %s)", resourceType, field, value));
    }
}

// 비즈니스 로직 위반 시
public class BusinessLogicException extends RuntimeException {
    public BusinessLogicException(String message) {
        super(message);
    }
}

// 사용 예시:
// throw new ResourceNotFoundException("챌린지", challengeId);
// throw new DuplicateResourceException("이메일", "email", userEmail);
// throw new BusinessLogicException("이미 참여 중인 챌린지입니다.");
