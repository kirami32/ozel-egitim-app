import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hizSinirinaTakildiMi } from "@/lib/rate-limit";
import type { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      adSoyad: string;
      email: string;
      rol: Role;
      institutionId: string | null;
    };
  }
  interface User {
    rol: Role;
    institutionId: string | null;
    adSoyad: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    rol: Role;
    institutionId: string | null;
    adSoyad: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/giris" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        if (hizSinirinaTakildiMi(email.toLowerCase().trim())) {
          throw new Error("Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.");
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user || !user.aktifMi) return null;

        const gecerliMi = await bcrypt.compare(password, user.sifreHash);
        if (!gecerliMi) return null;

        return {
          id: user.id,
          email: user.email,
          adSoyad: user.adSoyad,
          rol: user.rol,
          institutionId: user.institutionId,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id!;
        token.rol = user.rol;
        token.institutionId = user.institutionId;
        token.adSoyad = user.adSoyad;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.user.institutionId = token.institutionId;
      session.user.adSoyad = token.adSoyad;
      return session;
    },
  },
});
