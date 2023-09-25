import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import { Button } from "~/components/button/index.css";
import { Input } from "~/components/input/index.css";
import prisma from '~/service/prisma';
import bcrypt from 'bcrypt';
import { hash } from "~/routes/plugin@auth";

export const useCreateUser = routeAction$(
  async (data, context) => {
    data.password = await hash(data.password);

    try {
      const user = await prisma.user.create({
        data,
      });

      context.cookie.set('user', user, { path: '/', sameSite: 'strict' });

      context.redirect(301, '/');
    } catch (e) {
      return { error: 'Account creation fail !' }
    }
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
  const createUserAction = useCreateUser();

  return (
    <div class="container w-2/5 bg-white text-black flex flex-col items-center">
      <div class="text-black mb-8 text-4xl font-bold">Create an account</div>
      <Form action={createUserAction} class="flex flex-col w-full">
        <label>
          Pseudo
          <Input name="pseudo" />
        </label>
        <label>
          Password
          <Input type="password" name="password" />
        </label>
        <label>
          First name
          <Input name="firstname" />
        </label>
        <label>
          Last name
          <Input name="lastname" />
        </label>
        <label>
          Email
          <Input name="email" type="email" />
        </label>
        <Button type="submit" class="mt-4">Create</Button>
        {createUserAction.value?.error && <div class="text-red-700">{createUserAction.value?.error}</div>}
      </Form>
    </div>
  );
});