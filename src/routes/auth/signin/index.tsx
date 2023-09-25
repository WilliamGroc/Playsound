import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import passport from "passport";
import { Button } from "~/components/button/index.css";
import { Input } from "~/components/input/index.css";
import { localStrategy } from "~/routes/plugin@auth";

export const useAuthSignin = routeAction$(
  async (data, context) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(localStrategy, (error: any, user: any) => {
        if (error) {
          console.log({ error });
          reject({ error });
        }
        else {
          context.cookie.set('user', user, { path: '/', sameSite: 'strict' });
          context.redirect(301, '/');

          resolve(true);
        }
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

  console.log(signIn.value?.failed)

  return <section class="container w-2/5 bg-white text-black flex flex-col items-center">
    <div class="text-black mb-8 text-4xl font-bold">Login</div>
    <Form action={signIn} class="flex flex-col w-full">
      <label>
        Email
        <Input name="email" type="email" />
      </label>
      <label>
        Password
        <Input type="password" name="password" />
      </label>
      <Button type="submit" class="mt-4">Login</Button>
      {signIn.value?.error && <div class="text-red-700">{signIn.value?.error}</div>}
    </Form>
    <a href="/auth/register" class="mt-2">Register</a>
  </section>
});