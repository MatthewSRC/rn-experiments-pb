import { BottomTab } from 'components/finance/BottomTab';
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
      <Tabs.Screen name="home" />
      <Tabs.Screen name="invoices" />
      <Tabs.Screen name="sales" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
