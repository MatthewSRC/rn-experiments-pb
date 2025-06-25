import { Stack } from 'expo-router';

export default function TrendsLayout() {
  return <TrendsLayoutNav />;
}

function TrendsLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
