import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return <LibraryLayoutNav />;
}

function LibraryLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
