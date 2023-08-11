import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Cookie, DocumentHead, RequestHandler, routeAction$, routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/header';
import Footer from '~/components/footer';

import styles from './styles.css?inline';
import ToasterProvider from '~/context/toaster/toaster.context';
import { User } from '@prisma/client';

function loadUserFromCookie(cookie: Cookie): User | null {
  if (cookie) {
    return cookie.get('user')?.json() as User;
  } else {
    return null;
  }
}

export const onRequest: RequestHandler = async ({
  sharedMap,
  cookie,
  next
}) => {
  const user = loadUserFromCookie(cookie);
  sharedMap.set('user', user);
  await next();
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export const useUserSession = routeLoader$((req) => {
  return {
    user: req.sharedMap.get('user')
  }
});

export const useSignOut = routeAction$((_, context) => {
  context.sharedMap.delete('user');
  context.cookie.delete('user');
  context.redirect(301, '/');
});

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <Header />
      <main>
        <ToasterProvider>
          <Slot />
        </ToasterProvider>
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Playsound',
};
