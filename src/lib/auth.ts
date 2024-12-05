import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 2, // 2 hours
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  pages: { signIn: "/users/sign-in" },
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    signIn: async ({ account, profile }) => {
      console.log("account: ", account);
      console.log("profile: ", profile);

      // 이메일 중복 가입 방지를 위한 전체 흐름 요약:
      // 1. 사용자가 로그인 시도를 하면 데이터베이스에서 동일 이메일을 가진 사용자가 있는지 확인.
      // 1-1. 없으면 해당 이메일(소셜 제공자)로 회원 가입 및 로그인 진행
      // 2. 사용자가 로그인하려는 소셜 제공자가 이미 연결된 상태라면 정상적으로 로그인 허용.
      // 3. 사용자가 로그인하려는 소셜 제공자가 기존에 연결되지 않았다면, 이미 다른 소셜 제공자로 가입되어 있다는 메시지와 함께 로그인 제한.

      // 소셜 로그인 요청 시, 각 provider 들의 반환값(profile)의 형태가 서로 다르므로 email 을 조회하기 위해 하나의 형식으로 통일하기 위한 로직.
      let forCheckEmail = "";

      if (account?.provider === "kakao") {
        forCheckEmail = profile?.["kakao_account"]?.email; // 실제 카카오 프로필의 이메일 경로를 확인해야 함
      } else if (account?.provider === "naver") {
        forCheckEmail = profile?.["response"]?.email; // 실제 네이버 프로필의 이메일 경로를 확인해야 함
      } else {
        forCheckEmail = profile?.email || "";
      }

      // account?.provider && profile?.email
      if (account?.provider && forCheckEmail) {
        const existingUser = await prisma.user.findUnique({
          where: { email: forCheckEmail },
          include: { accounts: true },
        });

        if (existingUser) {
          console.log("existingUser: ", existingUser);
          const isProviderLinked = existingUser.accounts.some((acc) => acc.provider === account.provider);

          if (!isProviderLinked) {
            // 동일 이메일이 다른 provider 로 이미 가입됨
            return `/users/sign-in?error=alreadyLinked&provider=${existingUser.accounts[0].provider}`;
          }
        }
      }
      return true; // 로그인 허용
    },
  },
};
