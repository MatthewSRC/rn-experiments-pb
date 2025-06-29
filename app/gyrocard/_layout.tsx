import { Stack } from 'expo-router';

export default function CardSelectionLayout() {
  return <CardSelectionLayoutNav />;
}

function CardSelectionLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
