import { View, Text, useWindowDimensions } from 'react-native';

import { LineChart } from '../home/StatsCard';

export function MoodChart() {
  const { width } = useWindowDimensions();
  return (
    <View className="justify-around rounded-3xl bg-white/80 p-4">
      <Text className="text-center text-lg font-medium">Mood over the last week</Text>
      <LineChart color="#c084fc" data={data} width={(width * 80) / 100} height={200} />
    </View>
  );
}

const data = [25, 60, 35, 70, 45, 90, 55, 80, 40, 95].reverse();
