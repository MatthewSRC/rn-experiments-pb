import Entypo from '@expo/vector-icons/Entypo';
import { CustomBackground } from 'components/mentalhealth/CustomBackground';
import { LessonCard } from 'components/mentalhealth/trends/LessonCard';
import { MoodChart } from 'components/mentalhealth/trends/MoodChart';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Trends() {
  return (
    <View className="flex-1">
      <CustomBackground colors={['#93c5fd', '#bfdbfe', '#93c5fd']} />
      <SafeAreaView className="flex-1 p-4">
        <View className="flex-row justify-between">
          <Text className="text-3xl font-medium">Your condition{'\n'}has worsen recently</Text>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>
        <View className="h-6" />
        <MoodChart />
        <View className="h-4" />
        <Text className="text-2xl font-medium">Test to understand the reasons</Text>
        <View className="h-2" />
        <View className="mb-24 flex-1 gap-1">
          <View className="flex-1">
            <LessonCard size="large" title={lessons[0].title} duration={lessons[0].duration} />
          </View>
          <View className="flex-1 flex-row gap-1">
            <LessonCard size="small" title={lessons[1].title} duration={lessons[1].duration} />
            <LessonCard size="small" title={lessons[2].title} duration={lessons[2].duration} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const lessons = [
  { id: 0, title: 'The balance of life today', duration: 15 },
  { id: 1, title: 'Your source of negativity', duration: 30 },
  { id: 2, title: 'Triggers of bad moods', duration: 20 },
];
