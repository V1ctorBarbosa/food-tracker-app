import { useSession } from '@/entities/session';
import { DeleteAccountPage } from '@/pages/delete-account/DeleteAccountPage';

/** Reachable signed in or out: it is the public link the app stores point to for deleting an account. */
export default function DeleteAccountRoute() {
  const session = useSession();

  return <DeleteAccountPage session={session} />;
}
