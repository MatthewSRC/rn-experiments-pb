import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function SongLayout() {
  return (
    <GestureHandlerRootView>
      <SongLayoutNav />
    </GestureHandlerRootView>
  );
}

function SongLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ freezeOnBlur: true }} />
      <Stack.Screen
        name="timerModal"
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
        initialParams={{ hideTab: true }}
      />
      <Stack.Screen
        name="controlModal"
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
        initialParams={{ hideTab: true }}
      />
    </Stack>
  );
}
