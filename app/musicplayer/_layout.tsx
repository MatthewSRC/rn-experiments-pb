import { Stack } from 'expo-router';

export default function MusicPlayerLayout() {
  return <MusicPlayerLayoutNav />;
}

function MusicPlayerLayoutNav() {
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="song" />
    </Stack>
  );
}
