import { component$, useStore, $, QwikChangeEvent } from "@builder.io/qwik";
import { routeAction$, routeLoader$, server$ } from "@builder.io/qwik-city";
import { Song } from "@prisma/client";
import axios from "axios";
import { Button } from "~/components/button/index.css";
import { DeezerSong } from "~/models/deezerSong.model";
import prisma from '~/service/prisma';

export const usePlaylistLoader = routeLoader$(async (request) => {

  const playlistId = request.params['id'];

  const playlist = await prisma.playlist.findFirst({
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


    const song: Omit<Song, 'id'> = {
      deezerId: String(songToAdd.id),
      title: songToAdd.title,
      artist: songToAdd.artist.name,
      link: songToAdd.link,
      duration: songToAdd.duration,
      preview: songToAdd.preview,
      playlistId: this.params['id']
    }

    const newSong = await prisma.song.create({ data: song });
    return newSong;
  }
});

export default component$(() => {
  const playlistLoaded = usePlaylistLoader();

  const playlist = useStore<Song[]>(playlistLoaded.value?.songs || []);
  const searchedSongs = useStore<DeezerSong[]>([]);
  const selectedSong = useStore<{ song: Song | null }>({ song: null });

  const searchSong = $(async (event: QwikChangeEvent<HTMLInputElement>) => {
    const { data: { songs: { data } } } = await axios.get(`/api/songs/${event.target.value}`);
    searchedSongs.splice(0, searchedSongs.length, ...data);
  });

  const selectSong = $((song: Song) => {
    selectedSong.song = null;
    setTimeout(() => {
      selectedSong.song = song;
    });
  });

  return <div class="container">
    <h1>
      {playlistLoaded.value?.name}
    </h1>
    <div class="flex">
      <div class="flex-1">
        <input type="text" onChange$={searchSong} placeholder="Search song" class="mb-3" />
        <ul class="overflow-auto">
          {searchedSongs.map(song => <li key={song.id}><button onClick$={async () => {
            const newSong = await addSongToPlaylist(song);
            if (newSong)
              playlist.push(newSong);
          }}>+</button> {song.artist.name} - {song.title}</li>)}
        </ul>
      </div>
      <div class="flex-1">
        <ul>
          {playlist.map(song => <li
            key={song.id}
            onClick$={() => selectSong(song)}
            class="cursor-pointer"
          >
            {song.artist} - {song.title}
          </li>)}
        </ul>
      </div>
      <div class="flex-1">
        {selectedSong.song &&
          (
            <div>
              <div class="flex">
                <h2>{selectedSong.song.title}</h2>
                <Button onClick$={() => selectedSong.song = null}>Close</Button>
              </div>
              <div>
                <audio controls>
                  <source src={selectedSong.song.preview} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
      </div>
    </div>
  </div>
})