import 'server-only'

import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { SignInSchema } from '@/types'
import { createServiceClient } from '@/lib/supabase/server'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = SignInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const supabase = createServiceClient()
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, username, role, password_hash')
          .eq('email', parsed.data.email)
          .single()

        if (error || !profile?.password_hash) return null

        const valid = await bcrypt.compare(
          parsed.data.password,
          profile.password_hash
        )
        if (!valid) return null

        return {
          id: profile.id,
          email: profile.email,
          name: profile.username,
          role: profile.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const supabase = createServiceClient()
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!existing) {
          await supabase.from('profiles').insert({
            id: crypto.randomUUID(),
            email: user.email,
            username: user.name ?? user.email.split('@')[0],
            role: 'user',
            avatar_url: user.image ?? null,
          })
        } else {
          await supabase
            .from('profiles')
            .update({ avatar_url: user.image ?? null })
            .eq('id', existing.id)
        }
      }
      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        if (account?.provider === 'credentials') {
          token.sub = user.id
          token.role = user.role ?? 'user'
        } else if (user.email) {
          // OAuth — resolve internal profile ID and role
          const supabase = createServiceClient()
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('email', user.email)
            .single()
          if (profile) {
            token.sub = profile.id
            token.role = profile.role
          }
        }
      }

      if (trigger === 'update' && session?.role) {
        token.role = session.role as string
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.role = (token.role as string) ?? 'user'
      return session
    },
  },
})
