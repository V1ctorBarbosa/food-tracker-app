import { useSession } from '@/entities/session';
import { UserProfilePage } from '@/pages/user-profile/UserProfilePage';

export default function YouRoute() {
  const session = useSession();

  if (session.status !== 'signed-in') {
    return null;
  }

  return <UserProfilePage user={session.user} />;
}
