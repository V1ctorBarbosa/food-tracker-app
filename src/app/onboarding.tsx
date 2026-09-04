import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileQuery } from '@/entities/profile';
import { useSession } from '@/entities/session';
import { useAuthErrorRecovery } from '@/features/auth';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

export default function OnboardingRoute() {
  const session = useSession();
  const profileQuery = useProfileQuery();
  const authErrorRecovery = useAuthErrorRecovery(profileQuery.error);

  if (session.status === 'loading' || (session.status === 'signed-in' && profileQuery.isPending)) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  if (session.status === 'signed-out') {
    return <Redirect href="/sign-in" />;
  }

  if (profileQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg px-7">
        <ErrorMessage message={authErrorRecovery.isRecovering ? authErrorRecovery.message : undefined} />
      </SafeAreaView>
    );
  }

  if (profileQuery.data !== null) {
    return <Redirect href="/today" />;
  }

  return <OnboardingPage />;
}
