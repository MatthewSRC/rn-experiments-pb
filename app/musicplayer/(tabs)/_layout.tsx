import { BottomTab } from 'components/musicplayer/BottomTab';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return <TabsLayoutNav />;
}

function TabsLayoutNav() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTab {...props} />}>
      <Tabs.Screen name="home" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="search" options={{ tabBarLabel: 'Search' }} />
      <Tabs.Screen name="library" options={{ tabBarLabel: 'Library' }} />
    </Tabs>
  );
}
