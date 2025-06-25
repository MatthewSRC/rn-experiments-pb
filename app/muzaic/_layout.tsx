import { Stack } from 'expo-router';

export default function MuzaicLayout() {
  return <MuzaicLayoutNav />;
}

function MuzaicLayoutNav() {
  return (
    <Stack initialRouteName="mood" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="mood" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
