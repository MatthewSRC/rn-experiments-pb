import { BottomTab } from 'components/muzaic/BottomTab';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return <TabsLayoutNav />;
}

function TabsLayoutNav() {
  return (
    <Tabs
      initialRouteName="song"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomTab {...props} />}>
      <Tabs.Screen name="discovery" />
      <Tabs.Screen name="song" options={{ freezeOnBlur: true }} />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
