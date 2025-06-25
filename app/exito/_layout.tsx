import { Stack } from 'expo-router';

export default function ExitoLayout() {
  return <ExitoLayoutNav />;
}

function ExitoLayoutNav() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
