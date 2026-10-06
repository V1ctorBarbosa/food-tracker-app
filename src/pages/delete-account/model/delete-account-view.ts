import type { SessionState } from '@/entities/session';

export type DeleteAccountView = 'loading' | 'deleted' | 'sign-in' | 'confirm';

/** Labels for everything the deletion erases, in the order the page lists them. */
export const DeletedDataLabels: readonly string[] = [
  'Refeições e os alimentos de cada uma',
  'Registros de peso e de água',
  'Alimentos personalizados que você criou',
  'Seu perfil e suas metas',
  'Sua conta de acesso (login com Google)',
];

/**
 * Which state the page shows. A finished deletion wins over the session, because the deletion
 * signs the user out and the page must then confirm it instead of offering to sign in again.
 */
export function resolveDeleteAccountView(sessionStatus: SessionState['status'], wasDeleted: boolean): DeleteAccountView {
  if (wasDeleted) {
    return 'deleted';
  }

  if (sessionStatus === 'loading') {
    return 'loading';
  }

  if (sessionStatus === 'signed-out') {
    return 'sign-in';
  }

  return 'confirm';
}
