import { component$ } from "@builder.io/qwik";
import { Container } from "./index.css";
import { Song } from "@prisma/client";

type Props = {
  song: Song,
  handleClick: (song: Song) => void
}

export default component$(({ song, handleClick }: Props) => {
  return <Container onClick$={async () => {
    handleClick(song);
  }} role="button">
    <img src={song.cover} alt={`${song.title} img`} />
    <div class="ml-2 flex flex-col">
      <span>{song.title}</span>
      <span>{song.artist}</span> 
      <span>{song.duration} min</span> 
    </div>
  </Container>
})