import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";

const GITHUB_CLEINT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLEINT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLEINT_ID || !GITHUB_CLEINT_SECRET) {
  throw new Error("Missing github oauth credentials");
}

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: GITHUB_CLEINT_ID,
      clientSecret: GITHUB_CLEINT_SECRET,
    }),
  ],
  callbacks: {
    // Usually not needed fixing in nextauth in future
    async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
});
