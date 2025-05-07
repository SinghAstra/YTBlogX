import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET;

if (!NEXT_AUTH_SECRET) {
  throw new Error("NEXT_AUTH_SECRET must be provided");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be provided");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        console.log("In jwt callback.");
        console.log("token.accessToken is ", token.accessToken);
        console.log("token.refreshToken is ", token.refreshToken);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      console.log("In session callback.");
      console.log("session.user.accessToken is ", session.user.accessToken);
      console.log("session.user.refreshToken is ", session.user.refreshToken);
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
