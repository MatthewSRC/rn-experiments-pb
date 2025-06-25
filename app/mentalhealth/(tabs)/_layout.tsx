import { BottomTab } from 'components/mentalhealth/BottomTab';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return <TabsLayoutNav />;
}

function TabsLayoutNav() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{ headerShown: false, animation: 'none' }}
      tabBar={(props) => <BottomTab {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="trends" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
