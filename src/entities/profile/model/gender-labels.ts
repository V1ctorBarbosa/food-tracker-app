import type { Gender } from './profile.types';

const GenderLabels: Record<Gender, string> = {
  Male: 'Masculino',
  Female: 'Feminino',
  TransMale: 'Homem trans',
  TransFemale: 'Mulher trans',
  Nonbinary: 'Não binário',
  Other: 'Outro',
};

export function getGenderLabel(gender: Gender): string {
  return GenderLabels[gender];
}
