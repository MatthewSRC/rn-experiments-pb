import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DynamicText } from 'components/common/DynamicText';
import { AnimatedMetrics } from 'components/finance/AnimatedMetrics';
import { useEffect, useState } from 'react';
import { Text, View, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-between pb-40">
        <View className="flex-row items-center justify-between p-6">
          <Ionicons name="filter" size={24} color="white" />
          <View className="flex-row items-center gap-7 rounded-full border-[1px] border-white/50 p-[2px] pl-3">
            <Text className="text-md color-white">David</Text>
            <Image source={require('assets/images/finance/david.png')} className="h-10 w-10" />
          </View>
        </View>
        <View className="gap-4">
          <View className="flex-row justify-between p-6">
            <View>
              <Text className="text-4xl font-bold color-white">Hello David</Text>
              <Text className="text-lg color-white">Welcome Back !</Text>
            </View>
            <View className="-mt-4 flex-row items-center gap-10">
              <Feather name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
              <View className="rounded-xl border-[1px] border-white/50 px-4 py-2">
                <FontAwesome6 name="sliders" size={20} color="white" />
              </View>
            </View>
          </View>
          <FlatList
            horizontal
            ListHeaderComponent={<View className="w-6" />}
            ListFooterComponent={<View className="w-6" />}
            showsHorizontalScrollIndicator={false}
            data={['All', 'Pending', 'Received', 'Other']}
            ItemSeparatorComponent={() => <View className="w-2" />}
            renderItem={({ item }) => (
              <View className="h-12 min-w-[88px] items-center justify-center rounded-full bg-neutral-800 px-8">
                <Text className="text-md text-white">{item}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <View className="flex-1">
        <AnimatedMetrics
          position={{ x: 0.52, y: 0.1 }}
          topLeftComponent={<SalesTile />}
          topRightComponent={<CustomersTile />}
          bottomLeftComponent={<ProductsTile />}
          bottomRightComponent={<RevenueTile />}
        />
      </View>
    </SafeAreaView>
  );
}

function SalesTile() {
  const [counter, setCounter] = useState(230);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((s) => Math.round(s + Math.random()));
    }, 30000);
    return () => clearInterval(interval);
  });
  return (
    <View className="items-center">
      <MaterialCommunityIcons name="sale" size={24} color="white" />
      <View className="h-3" />
      <DynamicText style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
        {`${counter.toString()}K`}
      </DynamicText>
      <View className="h-1" />
      <Text className="text-white">Sales</Text>
    </View>
  );
}

function CustomersTile() {
  const [counter, setCounter] = useState(8545);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((s) => Math.round(s + Math.random()));
    }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <View className="items-center">
      <FontAwesome name="user-circle-o" size={24} color="black" />
      <View className="h-3" />
      <DynamicText style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>
        {`${new Intl.NumberFormat('de-DE').format(counter)}K`}
      </DynamicText>
      <View className="h-1" />
      <Text className="text-black">Customers</Text>
    </View>
  );
}

function ProductsTile() {
  const [counter, setCounter] = useState(1425);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((s) => Math.round(s + Math.random()));
    }, 10000);
    return () => clearInterval(interval);
  });
  return (
    <View className="items-center">
      <MaterialCommunityIcons name="package-variant-closed" size={24} color="black" />
      <View className="h-3" />
      <DynamicText style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>
        {`${new Intl.NumberFormat('de-DE').format(counter)}K`}
      </DynamicText>
      <View className="h-1" />
      <Text className="text-black">Products</Text>
    </View>
  );
}

function RevenueTile() {
  const [counter, setCounter] = useState(9750);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((s) => Math.round(s + Math.random() * 10));
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <View className="items-center">
      <FontAwesome name="pie-chart" size={24} color="white" />
      <View className="h-3" />
      <DynamicText style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
        {`$${counter.toString()}`}
      </DynamicText>
      <View className="h-1" />
      <Text className="text-white">Revenue</Text>
    </View>
  );
}
