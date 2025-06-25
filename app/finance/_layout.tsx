import { Stack } from 'expo-router';

export default function FinanceLayout() {
  return <FinanceLayoutNav />;
}

function FinanceLayoutNav() {
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
