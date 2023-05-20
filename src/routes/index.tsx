import { component$ } from '@builder.io/qwik';
import { DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { PrismaClient } from '@prisma/client';
import { Button } from '~/components/button/index.css';
import PlaylistTile from '~/components/playlistTile';
import { useAuthSession } from './plugin@auth';

export const playlistLoader = routeLoader$(async (request) => {
  const prismaClient = new PrismaClient();
  const id = request.sharedMap.get('session')?.userId;

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
})

export default component$(() => {
  const playlists = playlistLoader();
  const session = useAuthSession();

  return (
    <div class="container">
      <div>
        <Link href='/playlist/new'><Button>Create playlist</Button></Link>
      </div>
      <div class="flex flex-wrap mt-2">
        {playlists.value?.map(playlist => <PlaylistTile
          key={playlist.id}
          playlist={playlist}
          isAdmin={session.value?.userId === playlist.createdById}
        />)}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
