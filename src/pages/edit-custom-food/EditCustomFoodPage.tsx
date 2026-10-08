import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { findCustomFoodById, useCustomFoodsQuery, useUpdateCustomFoodMutation } from '@/entities/food';
import { CustomFoodForm, foodToFormFields, type CustomFoodValues } from '@/features/custom-food-form';
import { BackPill } from '@/shared/ui/BackPill';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingBar } from '@/shared/ui/LoadingBar';

const BackLabel = 'Meus alimentos';
const FormTitle = 'Valores por 100 g';
const SaveErrorMessage = 'Não foi possível salvar as alterações. Tente novamente.';

export function EditCustomFoodPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customFoodsQuery = useCustomFoodsQuery();
  const updateCustomFoodMutation = useUpdateCustomFoodMutation();

  if (customFoodsQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-ft-bg">
        <LoadingBar />
      </SafeAreaView>
    );
  }

  const food = findCustomFoodById(customFoodsQuery.data, id);

  if (customFoodsQuery.isError || food === null) {
    return (
      <SafeAreaView className="flex-1 bg-ft-bg">
        <View className="flex-row px-7 pt-4">
          <BackPill label={BackLabel} onPress={() => router.back()} />
        </View>
        <View className="flex-1 items-center justify-center px-7">
          <ErrorMessage message="Não encontramos esse alimento." />
        </View>
      </SafeAreaView>
    );
  }

  const foodId = food.id;

  let saveErrorMessage: string | null = null;
  if (updateCustomFoodMutation.isError) {
    saveErrorMessage = SaveErrorMessage;
  }

  async function handleSave(values: CustomFoodValues) {
    await updateCustomFoodMutation.mutateAsync({ id: foodId, request: values });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-ft-bg">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-row px-7 pt-4">
          <BackPill label={BackLabel} onPress={() => router.back()} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-7 pt-4 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text className="font-display text-4xl uppercase text-ft-ink">Editar alimento</Text>

          <CustomFoodForm
            key={food.id}
            title={FormTitle}
            initialFields={foodToFormFields(food)}
            submitLabel="Salvar alterações"
            isSaving={updateCustomFoodMutation.isPending}
            errorMessage={saveErrorMessage}
            onSubmit={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
