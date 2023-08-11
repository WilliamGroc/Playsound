import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$ } from '@builder.io/qwik-city';
import { PrismaClient } from '@prisma/client';
import { Button } from '~/components/button/index.css';
import PlaylistTile from '~/components/playlistTile';
import { useUserSession } from './layout';

export const playlistLoader = routeLoader$(async (request) => {
  const prismaClient = new PrismaClient();
  const id = request.sharedMap.get('user')?.id;

  if (id) {
    const data = await prismaClient.playlist.findMany({
      where: {
        OR: [
          {
            createdBy: {
              id
            }
          },
          {
            users: {
              some: {
                userId: id
              }
            }
          }
        ]
      },
    });

    return data
  }

  return null;
});

export default component$(() => {
  const playlists = playlistLoader();
  const session = useUserSession();

  return (
    <div class="container">
      <div>
        <Link href='/playlist/new'><Button>Create playlist</Button></Link>
      </div>
      <div class="flex flex-wrap mt-2">
        {playlists.value?.map(playlist => <PlaylistTile
          key={playlist.id}
          playlist={playlist}
          isAdmin={session.value?.user.id === playlist.createdById}
        />)}
      </div>
    </div>
  );
});
