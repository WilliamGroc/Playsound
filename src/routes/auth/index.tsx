import { component$ } from "@builder.io/qwik";
import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import Login from "~/components/login";
import Register from "~/components/register";
import passport, { localStrategy } from '~/routes/plugin@auth';

export const useCreateUser = routeAction$(
  async (data) => {
    const prisma = new PrismaClient();
    const user = await prisma.user.create({
      data,
    });
    return user;
  },
  zod$({
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
    email: z.string().email(),
    pseudo: z.string()
  })
);

export const useAuthSignin = routeAction$(
  async (data, context) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(localStrategy, (error: any, user: any) => {
        if (error) {
          console.log({ error });
          reject({ error });
        }

        context.cookie.set('user', user, { path: '/', sameSite: 'strict' });

        context.redirect(301, '/');

        resolve(true);
      })({ ...context.request, body: data }, context);
    });
  },
  zod$({
    email: z.string().email(),
    password: z.string()
  })
)

export default component$(() => {
  const signIn = useAuthSignin();
  const createUserAction = useCreateUser();

  return <div class="flex justify-center items-center">
    <Login handleLogin={signIn} />
    <Register handleRegister={createUserAction} />
  </div>
})