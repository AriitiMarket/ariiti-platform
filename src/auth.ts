import { NextAuthOptions, getServerSession } from "next-auth";
import NextAuth from "next-auth";
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
    signOut: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Ariiti Staff Credentials",
      credentials: {
        email: { label: "Corporate Email", type: "email", placeholder: "admin@ariititech.com" },
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

        // Asynchronously update lastLoginAt without blocking login
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
        token.role = (user as { role: UserRole }).role;
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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return `${baseUrl}/admin/login`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const auth = async () => {
  try {
    return await getServerSession(authOptions);
  } catch {
    // Graceful fallback outside Next.js request context (e.g. unit tests)
    return null;
  }
};

const handler = NextAuth(authOptions);
export const handlers = { GET: handler, POST: handler };
export default handler;
