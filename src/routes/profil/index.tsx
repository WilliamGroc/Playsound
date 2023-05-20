import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import { Button } from "~/components/button/index.css";
import { ToasterColor, ToasterContext } from "~/context/toaster/toaster.context";

const userLoader = routeLoader$(async (request) => {
  const prismaClient = new PrismaClient();
  const id = request.sharedMap.get('session').userId;
  const user = await prismaClient.user.findFirst({
    where: { id }
  })

  return {
    user: {
      pseudo: user?.pseudo,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      spotifyApi: user?.spotifyApi,
      deezerApi: user?.deezerApi
    }
  }
})

const editUserAction = routeAction$(async (data, request) => {
  const prismaClient = new PrismaClient();
  const id = request.sharedMap.get('session').userId;

  await prismaClient.user.update({
    data,
    where: { id }
  });

  return { success: true }
});

export default component$(() => {
  const userData = userLoader();
  const editUser = editUserAction();
  const toasterContext = useContext(ToasterContext);

  useTask$(({ track }) => {
    track(() => editUser.isRunning)
    
    if (editUser.value?.success && !editUser.isRunning)
      toasterContext.addToaster({ message: 'Update success', color: ToasterColor.SUCCESS });
  })

  return <div class="container">
    <Form action={editUser} class="flex flex-col">
      <label>
        Email
        <input name="email" type="email" value={userData.value.user?.email} />
      </label>
      <label>
        Pseudo
        <input name="pseudo" value={userData.value.user?.pseudo} />
      </label>
      <label>
        First name
        <input name="firstname" value={userData.value.user?.firstname} />
      </label>
      <label>
        Last name
        <input name="lastname" value={userData.value.user?.lastname} />
      </label>
      <label>
        Spotify api key
        <input name="spotifyApi" value={userData.value.user?.spotifyApi} />
      </label>
      <label>
        Deezer api key
        <input name="deezerApi" value={userData.value.user?.deezerApi} />
      </label>
      <Button type="submit">Update</Button>
    </Form>
  </div>
})