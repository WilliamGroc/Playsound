import { component$, useStore, $, QwikChangeEvent } from "@builder.io/qwik";
import { routeAction$, routeLoader$, server$ } from "@builder.io/qwik-city";
import { Song } from "@prisma/client";
import axios from "axios";
import { Button } from "~/components/button/index.css";
import { Input } from "~/components/input/index.css";
import SongCard from "~/components/song-card";
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

export const addSongToPlaylist = server$(async function (songToAdd: Song) {
  if (this.params['id']) {


    const song: Omit<Song, 'id'> = {
      ...songToAdd,
      playlistId: this.params['id']
    }

    const newSong = await prisma.song.create({ data: song });
    return newSong;
  }
});

export default component$(() => {
  const playlistLoaded = usePlaylistLoader();

  const playlist = useStore<Song[]>(playlistLoaded.value?.songs || []);
  const searchedSongs = useStore<Song[]>([]);
  const selectedSong = useStore<{ song: Song | null }>({ song: null });

  const searchSong = $(async (event: QwikChangeEvent<HTMLInputElement>) => {
    const { data: { songs: { data } } } = await axios.get(`/api/songs/${event.target.value}`);

    const songs: Song[] = data.map((song: DeezerSong) => ({
      deezerId: String(song.id),
      title: song.title,
      artist: song.artist.name,
      link: song.link,
      duration: song.duration,
      preview: song.preview,
      cover: song.album.cover
    }));

    searchedSongs.splice(0, searchedSongs.length, ...songs);
  });

  const selectSong = $((song: Song) => {
    selectedSong.song = null;
    setTimeout(() => {
      selectedSong.song = song;
    });
  });

  const addSong = $(async (song: Song) => {
    const newSong = await addSongToPlaylist(song);
    if (newSong)
      playlist.push(newSong);
  })

  return <div class="container">
    <h1>
      {playlistLoaded.value?.name}
    </h1>
    <div class="flex">
      <div class="flex-1">
        <Input type="text" onChange$={searchSong} placeholder="Search song" class="mb-3 w-full" />
        <ul class="overflow-auto">
          {searchedSongs.map(song => <SongCard song={song} handleClick={addSong} />)}
        </ul>
      </div>
      <div class="flex-1">
        <ul>
          {playlist.map(song => <SongCard song={song} handleClick={selectSong} />)}
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