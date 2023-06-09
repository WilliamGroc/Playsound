import { component$, useTask$ } from "@builder.io/qwik";
import { Form, routeAction$, useNavigate } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import { Button } from "~/components/button/index.css";

export const useCreatePlaylistAction = routeAction$(async (data, request) => {
  const prismaClient = new PrismaClient();
  const id = request.sharedMap.get('session').userId;

  const newPlaylist = await prismaClient.playlist.create({
    data: {
      name: data.name.toString(),
      createdBy: {
        connect: {
          id
        }
      }
    }
  });

  return {
    success: true,
    playlistId: newPlaylist.id
  };
});

export default component$(() => {
  const createPlaylistAction = useCreatePlaylistAction();
  const nav = useNavigate();

  useTask$(({ track }) => {
    track(() => createPlaylistAction.isRunning);

    if (createPlaylistAction.value?.success)
      nav(`/playlist/${createPlaylistAction.value.playlistId}`)
  });


  return <div class="container">
    <Form action={createPlaylistAction} class="flex flex-col">
      <label>
        Name
        <input name="name" />
      </label>
      <Button>Create playlist</Button>
    </Form>
  </div>
})