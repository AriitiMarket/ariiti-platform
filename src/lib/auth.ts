import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User, { UserRole } from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Corporate Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@ariititech.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        await connectDB();

        // Query user and explicitly select passwordHash
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+passwordHash");

        if (!user) {
          throw new Error("No corporate account registered with this email.");
        }

        if (!user.isActive) {
          throw new Error("This account has been deactivated. Contact an administrator.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password provided.");
        }

        // Update lastLoginAt asynchronously without blocking login
        User.updateOne(
          { _id: user._id },
          { $set: { lastLoginAt: new Date() } }
        ).exec();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
