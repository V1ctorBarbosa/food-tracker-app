import { useSession } from '@/entities/session';
import { YouPage } from '@/pages/you/YouPage';

export default function YouRoute() {
  const session = useSession();

  if (session.status !== 'signed-in') {
    return null;
  }

  return <YouPage user={session.user} />;
}
