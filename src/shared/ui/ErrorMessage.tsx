import { Text } from 'react-native';

const DefaultErrorMessage = 'Could not fetch data';

export function ErrorMessage({ message = DefaultErrorMessage }: { message?: string }) {
  return <Text className="text-center font-body-semibold text-sm text-ft-carbs">{message}</Text>;
}
