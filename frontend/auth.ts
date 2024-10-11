import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        // let user = null;

        // validate credentials
        // const parsedCredentials = signInSchema.safeParse(credentials);
        // if (!parsedCredentials.success) {
        //   console.error("Invalid credentials:", parsedCredentials.error.errors);
        //   return null;
        // }
        // get user
        const user = await db.users.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }
        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.hash_password
        );
        console.log("isMatch:", isMatch);

        if (!isMatch) {
          console.log("Error password");
          return null;
        }
        const newUser: User = {
          email: user.email,
          role: "user",
          id: user.id as unknown as string,
          image: user.avatarUrl,
          name: user.name,
        };
        return newUser;
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const role = auth?.user.role || "user";
      if (pathname.startsWith("/auth/signin") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      if (pathname.startsWith("/page2") && role !== "admin") {
        return Response.redirect(new URL("/", nextUrl));
      }
      return !!auth;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
        token.picture = user.image;
        token.name = user.name;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.image = token.picture;
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
