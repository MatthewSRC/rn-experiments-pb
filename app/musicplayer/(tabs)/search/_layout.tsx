import { Stack } from 'expo-router';

export default function SearchLayout() {
  return <SearchLayoutNav />;
}

function SearchLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
