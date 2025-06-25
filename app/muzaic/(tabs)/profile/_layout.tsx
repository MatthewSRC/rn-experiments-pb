import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return <ProfileLayoutNav />;
}

function ProfileLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
