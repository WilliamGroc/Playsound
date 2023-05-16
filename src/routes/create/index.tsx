import { component$ } from '@builder.io/qwik';
import { routeAction$, zod$, z, Form } from '@builder.io/qwik-city';
import { PrismaClient } from '@prisma/client';

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
    email: z.string().email(),
    pseudo: z.string()
  })
);

export default component$(() => {
  const createUserAction = useCreateUser();
  return (
    <section>
      <h1>Create User</h1>
      <Form action={createUserAction}>
        <label>
          Pseudo
          <input name="pseudo" value={createUserAction.formData?.get('pseudo')} />
        </label>
        <label>
          First name
          <input name="firstname" value={createUserAction.formData?.get('firstname')} />
        </label>
        <label>
          Last name
          <input name="lastname" value={createUserAction.formData?.get('lastname')} />
        </label>
        <label>
          Email
          <input name="email" value={createUserAction.formData?.get('email')} />
        </label>
        <button type="submit">Create</button>
      </Form>
      {createUserAction.value && (
        <div>
          <h2>User created successfully!</h2>
        </div>
      )}
    </section>
  );
});
