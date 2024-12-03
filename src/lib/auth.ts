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
      if (account?.provider && profile?.email) {
        console.log("account: ", account);
        console.log("profile: ", profile);
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
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
