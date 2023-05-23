import { RequestHandler } from "@builder.io/qwik-city";
import axios from 'axios';

export const onGet: RequestHandler = async (request) => {
  const response = await axios.get(`http://api.deezer.com/search?q=${request.params}`);

  request.json(200, {
    songs: response.data
  });
}