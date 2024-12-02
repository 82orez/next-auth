export { default } from "next-auth/middleware";

// sign in 한 사용자만이 접근 가능한 페이지 설정
export const config = { matcher: ["/dashboard"] };
