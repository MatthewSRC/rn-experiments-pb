import { Stack } from 'expo-router';

export default function SongLayout() {
  return <SongLayoutNav />;
}

function SongLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
