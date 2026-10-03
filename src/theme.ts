import { useColorScheme } from 'react-native';

const light = {
  bg: '#F5F6F8',
  card: '#FFFFFF',
  text: '#15171A',
  muted: '#6B7280',
  border: '#E5E7EB',
  primary: '#2E7D32',
  onPrimary: '#FFFFFF',
  danger: '#C62828',
  track: '#E5E7EB',
};

const dark: typeof light = {
  bg: '#0F1113',
  card: '#1A1D21',
  text: '#F3F4F6',
  muted: '#9CA3AF',
  border: '#2A2E34',
  primary: '#66BB6A',
  onPrimary: '#0F1113',
  danger: '#EF5350',
  track: '#2A2E34',
};

export type Theme = typeof light;

export const useTheme = (): Theme => (useColorScheme() === 'dark' ? dark : light);
