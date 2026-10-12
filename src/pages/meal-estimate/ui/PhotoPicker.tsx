import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import type { PhotoSource } from '@/shared/api/photo-capture';

/** Before a photo is chosen: the two ways to get one. After: the photo itself, with a way to change it. */
export function PhotoPicker({
  photoUri,
  onPickPhoto,
}: {
  photoUri: string | null;
  onPickPhoto: (source: PhotoSource) => void;
}) {
  if (photoUri === null) {
    return (
      <View className="gap-3 rounded-[22px] bg-ft-card p-5">
        <Text className="font-body-medium text-sm leading-5 text-ft-muted-2">Enquadre o prato inteiro, de cima, com boa luz.</Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => onPickPhoto('camera')}
            accessibilityRole="button"
            className="h-[54px] flex-1 items-center justify-center rounded-2xl bg-ft-protein">
            <Text className="font-body-bold text-base text-white">Câmera</Text>
          </Pressable>
          <Pressable
            onPress={() => onPickPhoto('library')}
            accessibilityRole="button"
            className="h-[54px] flex-1 items-center justify-center rounded-2xl border border-ft-ink">
            <Text className="font-body-bold text-base text-ft-ink">Galeria</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Image source={{ uri: photoUri }} contentFit="cover" style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 22 }} />
      <Pressable onPress={() => onPickPhoto('camera')} hitSlop={8} accessibilityRole="button">
        <Text className="font-body-semibold text-sm text-ft-ink">Trocar foto</Text>
      </Pressable>
    </View>
  );
}
