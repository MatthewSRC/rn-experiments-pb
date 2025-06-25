import { Stack } from 'expo-router';

export default function VPNLayout() {
  return <VPNLayoutNav />;
}

function VPNLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
