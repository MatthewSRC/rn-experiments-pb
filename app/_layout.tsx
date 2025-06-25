import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <GestureHandlerRootView>
        <Slot />
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </>
  );
}
