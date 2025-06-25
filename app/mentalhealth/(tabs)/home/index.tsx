import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomBackground } from 'components/mentalhealth/CustomBackground';
import { ExerciseCard } from 'components/mentalhealth/home/ExerciseCard';
import { MoodCalendar } from 'components/mentalhealth/home/MoodCalendar';
import { LineChart, StatsCard, StressChart } from 'components/mentalhealth/home/StatsCard';
import { Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { width } = useWindowDimensions();
  return (
    <View className="flex-1">
      <CustomBackground colors={['#86efac', '#bbf7d0', '#86efac']} />
      <SafeAreaView className="flex-1 p-4">
        <View className="flex-row justify-between">
          <Text className="text-3xl font-medium">Dear Alice,{'\n'}good morning</Text>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
            <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
          </View>
        </View>
        <View className="h-6" />
        <MoodCalendar />
        <View className="h-2" />
        <View className="flex-1 flex-row gap-2">
          <StatsCard title="Last week" description="Mood unstable">
            <LineChart color="#4CD2C0" data={data1} width={width / 3} height={60} />
          </StatsCard>
          <StatsCard title="Average stress level" description="67 % in a week">
            <StressChart data={data2} />
          </StatsCard>
        </View>
        <View className="h-8" />
        <Text className="text-2xl font-medium">Exercises for you</Text>
        <View className="h-4" />
        <ExerciseCard />
      </SafeAreaView>
    </View>
  );
}

const data1 = [25, 60, 35, 70, 45, 90, 55, 80, 40, 95];

const data2 = [
  { id: 0, value: 10 },
  { id: 1, value: 10 },
  { id: 2, value: 4 },
  { id: 3, value: 2 },
  { id: 4, value: 4 },
  { id: 5, value: 6 },
  { id: 6, value: 7 },
  { id: 7, value: 8 },
];
