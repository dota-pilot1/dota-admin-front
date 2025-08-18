export async function logoutApi(): Promise<void> {
    // localStorage에서 인증 정보 제거
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    // 로그인 페이지로 리다이렉트
    window.location.href = "/login";
}
