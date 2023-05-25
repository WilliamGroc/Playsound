import { component$, useStore, useTask$, $, QwikChangeEvent } from "@builder.io/qwik";
import { routeAction$, routeLoader$, server$ } from "@builder.io/qwik-city";
import { PrismaClient, Song } from "@prisma/client";
import axios from "axios";
import { DeezerSong } from "~/models/deezerSong.model";

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

export const addSongToPlaylist = server$(async function (songToAdd: DeezerSong) {
  if (this.params['id']) {

    const prismaClient = new PrismaClient();

    const song: Omit<Song, 'id'> = {
      deezerId: songToAdd.id,
      title: songToAdd.title,
      artist: songToAdd.artist.name,
      link: songToAdd.link,
      duration: songToAdd.duration,
      preview: songToAdd.preview,
      playlistId: this.params['id']
    }

    const newSong = await prismaClient.song.create({ data: song });
    return newSong;
  }
});

export default component$(() => {
  const playlist = usePlaylistLoader();
  const searchedSongs = useStore<DeezerSong[]>([]);

  const searchSong = $(async (event: QwikChangeEvent<HTMLInputElement>) => {
    const { data: { songs: { data } } } = await axios.get(`/api/songs/${event.target.value}`);
    searchedSongs.splice(0, searchedSongs.length, ...data);
  });


  return <div class="container">
    <h1>
      {playlist.value?.name}
    </h1>
    <div class="flex">
      <div class="flex-1">
        <input type="text" onChange$={searchSong} placeholder="Search song" class="mb-3" />
        <ul class="overflow-auto">
          {searchedSongs.map(song => <li key={song.id}><button onClick$={async () => {
            if (playlist.value) {
              const response = await addSongToPlaylist(song);
              console.log(response)
              // playlist.value.songs.push(response.data.newSong);
            }
          }}>+</button> {song.artist.name} - {song.title}</li>)}
        </ul>
      </div>
      <div class="flex-1">
        <ul>
          {playlist.value?.songs.map(song => <li key={song.id}>{song.artist} - {song.title}</li>)}
        </ul>
      </div>
    </div>
  </div>
})