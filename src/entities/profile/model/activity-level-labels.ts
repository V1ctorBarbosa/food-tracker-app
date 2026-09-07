import type { ActivityLevel } from './profile.types';

const ActivityLevelLabels: Record<ActivityLevel, string> = {
  Sedentary: 'Sedentário',
  Light: 'Leve',
  Moderate: 'Moderado',
  Active: 'Ativo',
  VeryActive: 'Muito ativo',
};

export function getActivityLevelLabel(activityLevel: ActivityLevel): string {
  return ActivityLevelLabels[activityLevel];
}
