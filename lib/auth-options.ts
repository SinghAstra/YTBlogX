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
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
