import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Playlist } from "@prisma/client";
import { Tile } from "./playlistTile.css";

type Props = {
  playlist: Playlist,
  isAdmin: boolean
}

export default component$(({ playlist, isAdmin }: Props) => {
  return <Link href={`/playlist/${playlist.id}`}>
    <Tile>
      {playlist.name} {isAdmin && '(admin)'}
    </Tile>
  </Link>
})