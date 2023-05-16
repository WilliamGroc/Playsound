import { component$ } from '@builder.io/qwik';
import { useAuthSession, useAuthSignin, useAuthSignout } from '~/routes/plugin@auth';
import { Header, HeaderLink, Logo } from './index.css';

export default component$(() => {
  const signIn = useAuthSignin();
  const signOut = useAuthSignout();
  const session = useAuthSession();

  console.log(session.value)

  return (
    <Header>
      <div class="flex justify-between">
        <Logo>
          <a href="/" title="Playsound home">
            Playsound
          </a>
        </Logo>
        <ul>
          {session.value ?
            <li>
              <HeaderLink onClick$={() => signOut.submit({ callbackUrl: '/' })}>
                Logout
              </HeaderLink>
            </li>
            : <li>
              <HeaderLink onClick$={() => signIn.submit({ providerId: 'github', options: { callbackUrl: 'http://localhost:5173' } })}>
                Login
              </HeaderLink>
            </li>
          }
        </ul>
      </div>
    </Header>
  );
});
