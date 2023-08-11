import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Button } from "../button/index.css";

type Props = {
  handleLogin: any
}

export default component$(({ handleLogin }: Props) => {
  return <section class="container container-purple">
    <h1>Sign in</h1>
    <Form action={handleLogin} class="flex flex-col">
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <Button type="submit">Submit</Button>
    </Form>
  </section>
});