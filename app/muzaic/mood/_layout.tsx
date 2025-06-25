import { Stack } from 'expo-router';

export default function MoodLayout() {
  return <MoodLayoutNav />;
}

function MoodLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
