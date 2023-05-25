import { RequestHandler } from "@builder.io/qwik-city";
import axios, { HttpStatusCode } from 'axios';
import { DeezerSong } from "~/models/deezerSong.model";

export const onGet: RequestHandler = async (request) => {
  const response = await axios.get<DeezerSong[]>(`http://api.deezer.com/search?q=track:"${request.params['search']}"`);

  request.json(HttpStatusCode.Ok, {
    songs: response.data
  });
};