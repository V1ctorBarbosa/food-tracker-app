import { Redirect } from 'expo-router';

import { useSession } from '@/entities/session';

export default function IndexRoute() {
  const session = useSession();

  if (session.status === 'loading') {
    return null;
  }

  if (session.status === 'signed-out') {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/today" />;
}
