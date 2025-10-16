import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = credentialsSchema.safeParse(credentials)

        if (!validatedCredentials.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: validatedCredentials.data.email },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          validatedCredentials.data.password,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
