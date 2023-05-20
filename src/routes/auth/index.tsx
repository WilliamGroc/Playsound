import { component$ } from "@builder.io/qwik";
import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import { Button } from "~/components/button/index.css";
import Register from "~/components/register";
import { useAuthSignin } from "../plugin@auth";

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

export default component$(() => {
  const signIn = useAuthSignin();
  const createUserAction = useCreateUser();

  return <div class="flex justify-center items-center">
    <section class="container container-purple flex justify-center">
      <Button onClick$={() => signIn.submit({ providerId: 'credentials', options: { callbackUrl: '/' } })}>Login</Button>
    </section>
    <Register handleRegister={createUserAction} />
  </div>
})