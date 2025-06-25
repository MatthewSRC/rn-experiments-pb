import { Stack } from 'expo-router';

export default function DiscoveryLayout() {
  return <DiscoveryLayoutNav />;
}

function DiscoveryLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
