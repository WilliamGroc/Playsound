import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { Button } from '../button/index.css';

type Props = {
  handleRegister: any
}

export default component$(({ handleRegister }: Props) => {
  return (
    <section class="container container-purple">
      <h1>Register</h1>
      <Form action={handleRegister} class="flex flex-col">
        <label>
          Pseudo
          <input name="pseudo" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <label>
          First name
          <input name="firstname" />
        </label>
        <label>
          Last name
          <input name="lastname" />
        </label>
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <Button type="submit">Submit</Button>
      </Form>
    </section>
  );
});
