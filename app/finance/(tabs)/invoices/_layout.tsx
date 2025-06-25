import { Stack } from 'expo-router';

export default function InvoicesLayout() {
  return <InvoicesLayoutNav />;
}

function InvoicesLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
