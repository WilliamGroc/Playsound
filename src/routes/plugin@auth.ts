import { serverAuth$ } from '@builder.io/qwik-auth';
import CredentialsProvider from '@auth/core/providers/credentials';
import type { Provider } from '@auth/core/providers';
import { PrismaClient } from '@prisma/client';
import { JWT } from '@auth/core/jwt';

const prisma = new PrismaClient();

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(
  ({ env }) => ({
    secret: env.get('AUTH_SECRET'),
    trustHost: true,
    callbacks: {
      jwt({ token, user }: { token: JWT, user: any }) {
        return { ...token, userId: user?.id || token.userId }
      },
      session(params: any) {
        return { ...params.session, userId: params.token.userId };
      }
    },
    providers: [
      CredentialsProvider({
        name: "Login",
        credentials: {
          email: { label: 'Email' },
          password: { label: 'Password', type: 'password' },
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
              return null;
            }

            return user
          }

          return null
        }
      }),
    ] as Provider[],
  })
);
