import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/header';
import Footer from '~/components/footer';

import styles from './styles.css?inline';
import ToasterProvider from '~/context/toaster/toaster.context';

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
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
