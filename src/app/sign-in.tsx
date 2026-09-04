import { Redirect } from 'expo-router';

import { useSession } from '@/entities/session';
import { SignInPage } from '@/pages/sign-in/SignInPage';

export default function SignInRoute() {
  const session = useSession();

  if (session.status === 'loading') {
    return null;
  }

  if (session.status === 'signed-in') {
    return <Redirect href="/today" />;
  }

  return <SignInPage />;
}
