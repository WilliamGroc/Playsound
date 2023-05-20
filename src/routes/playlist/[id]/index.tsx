import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";

export const usePlaylistLoader = routeLoader$(async (request) => {
  const prismaClient = new PrismaClient();

  const playlistId = request.params['id'];

  const playlist = await prismaClient.playlist.findFirst({
    where: {
      id: playlistId
    }
  });

  return playlist
})

export default component$(() => {
  const playlist = usePlaylistLoader();

  return <div class="container">
    <h1>
      {playlist.value?.name}
    </h1>
  </div>
})