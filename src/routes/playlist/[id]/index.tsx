import { component$, useStore, useTask$, $, QwikChangeEvent } from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Button } from "~/components/button/index.css";

export const usePlaylistLoader = routeLoader$(async (request) => {
  const prismaClient = new PrismaClient();

  const playlistId = request.params['id'];

  const playlist = await prismaClient.playlist.findFirst({
    where: {
      id: playlistId
    },
    select: {
      id: true,
      name: true,
      songs: true
    }
  });

  return playlist
});

export const usePlaylistSaveAction = routeAction$(async (formdata, request) => {
  console.log(formdata);
});

export default component$(() => {
  const playlist = usePlaylistLoader();
  const searchedSongs = useStore<any[]>([]);

  const searchSong = $(async (event: QwikChangeEvent<HTMLInputElement>) => {
    const { data: { songs: { data } } } = await axios.get(`/api/songs/${event.target.value}`);
    searchedSongs.splice(0, searchedSongs.length, ...data);
  });

  return <div class="container">
    <h1>
      {playlist.value?.name}
    </h1>
    <input type="text" onChange$={searchSong} />
    <Button>Add song</Button>
    <ul>
      {searchedSongs.map(song => <li>{song.artist.name} - {song.title}</li>)}
    </ul>
  </div>
})