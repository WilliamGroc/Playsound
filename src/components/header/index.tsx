import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Header, HeaderLink, Logo } from './index.css';
import { useSignOut, useUserSession } from '~/routes/layout';

export default component$(() => {
  const signOut = useSignOut();
  const session = useUserSession();

  const isConnected = !!session.value.user;

  return (
    <Header>
      <div class="flex justify-between">
        <Logo>
          <a href="/" title="Playsound home">
            Playsound
          </a>
        </Logo>
        <div class="flex">
          {isConnected ? <>
            <div>
              <Link href='/profil'>
                <HeaderLink>
                  Profil
                </HeaderLink>
              </Link>
            </div>
            <div>
              <HeaderLink onClick$={() => signOut.submit()}>
                Logout
              </HeaderLink>
            </div>
          </> :
            <div>
              <Link href="/auth">
                <HeaderLink>
                  Login
                </HeaderLink>
              </Link>
            </div>
          }
        </div>
      </div>
    </Header>
  );
});
