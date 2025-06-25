import { ScreenViewProvider } from 'context/useScreenView';
import { Stack } from 'expo-router';

export default function MentalHealthLayout() {
  return (
    <ScreenViewProvider>
      <MentalHealthLayoutNav />
    </ScreenViewProvider>
  );
}

function MentalHealthLayoutNav() {
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
