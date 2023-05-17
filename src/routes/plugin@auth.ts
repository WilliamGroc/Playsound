import { serverAuth$ } from '@builder.io/qwik-auth';
import CredentialsProvider from '@auth/core/providers/credentials';
import type { Provider } from '@auth/core/providers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(
  ({ env }) => ({
    secret: env.get('AUTH_SECRET'),
    trustHost: true,
    callbacks: {
      jwt({ token, user }) {
        return { ...token, userId: user?.id || token.userId }
      },
      session(params) {
        return { ...params.session, userId: params.token.userId };
      }
    },
    providers: [
      CredentialsProvider({
        name: "Login",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (credentials.email && credentials.password) {
            let user = await prisma.user.findFirst({
              where: {
                email: credentials.email as string,
                password: credentials.password as string
              }
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: credentials.email as string,
                  pseudo: credentials.email as string,
                  password: credentials.password as string
                }
              });
            }

            return user
          }

          return null
        }
      }),
    ] as Provider[],
  })
);
