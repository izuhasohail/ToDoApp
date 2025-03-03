// filepath: /e:/to-do-list/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type AuthOptions, type Session } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcrypt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
    }
  }
}

// filepath: /e:/to-do-list/lib/auth.ts
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
  
          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          })
  
          console.log("Credentials authorize", { credentials, user })
  
          if (!user || !user.password) {
            return null
          }
  
          const isPasswordValid = await compare(credentials.password, user.password)
  
          if (!isPasswordValid) {
            return null
          }
  
          console.log("Credentials authorize", { user })
  
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        },
      }),
    ],
    callbacks: {
        async session({ token, session }) {
          console.log("Session callback", { token, session });
          
          if (token) {
            session.user = {
              ...session.user,
              id: (typeof token.sub === "string" ? token.sub : (typeof token.id === "string" ? token.id : "")) || "",
              name: token.name || "",
              email: token.email || "",
              image: typeof token.picture === "string" ? token.picture : (typeof token.image === "string" ? token.image : "")
            };
          }
          
          return session;
        },
        
        async jwt({ token, user, account }) {
          console.log("JWT callback", { token, user, account });
          
          // If this is the first sign-in, keep the user data
          if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.picture = user.image;
          }
          
          // For returning users, you can refresh token data from DB if needed
          if (token.email) {
            const dbUser = await db.user.findUnique({
              where: {
                email: token.email,
              },
            });
            
            if (dbUser) {
              token.id = dbUser.id;
              token.name = dbUser.name;
              token.email = dbUser.email;
              token.picture = dbUser.image;
            }
          }
          
          return token;
        }
      }
  }