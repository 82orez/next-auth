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
      console.log("user: ", user);
      console.log("token: ", token);

      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        ...token,
      },
    }),

    signIn: async ({ account, profile }) => {
      console.log("account: ", account);
      console.log("profile: ", profile);

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
