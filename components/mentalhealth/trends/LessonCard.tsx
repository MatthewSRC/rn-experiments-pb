import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View, Image } from 'react-native';

export function LessonCard({ size, title, duration }: Props) {
  return (
    <View className="flex-1 flex-row items-center justify-between gap-4 rounded-3xl bg-white/80 p-4">
      <View className="h-full max-w-[60%] justify-between">
        <Text className={`${size === 'small' ? 'text-lg' : 'text-3xl'} font-medium`}>{title}</Text>
        <View className="flex-row items-center gap-2 self-start rounded-full bg-white px-4 py-2">
          <FontAwesome6 name="hourglass-empty" size={16} color="black" />
          <Text className="font-medium">{duration} min</Text>
        </View>
      </View>
      <View className="h-full flex-1">
        <Image
          source={require('assets/images/mentalhealth/happy.png')}
          style={{ height: '90%', width: '100%' }}
          resizeMode="contain"
          borderRadius={24}
        />
      </View>
      <Feather
        className="absolute bottom-4 right-4"
        name="arrow-up-right"
        size={32}
        color="black"
      />
    </View>
  );
}

interface Props {
  size: 'large' | 'small';
  title: string;
  duration: number;
}
