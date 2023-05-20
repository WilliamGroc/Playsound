import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useAuthSession, useAuthSignout } from '~/routes/plugin@auth';
import { Header, HeaderLink, Logo } from './index.css';

export default component$(() => {
  const signOut = useAuthSignout();
  const session = useAuthSession();

  const isConnected = !!session.value;

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
              <HeaderLink onClick$={() => signOut.submit({ callbackUrl: '/' })}>
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
