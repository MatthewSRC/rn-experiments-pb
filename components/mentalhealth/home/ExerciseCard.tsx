import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View, Image } from 'react-native';

export function ExerciseCard() {
  return (
    <View className="mb-24 flex-1 flex-row items-center justify-around rounded-3xl bg-white/40 p-4">
      <Image
        source={require('assets/images/mentalhealth/angry.png')}
        style={{ height: '90%', width: '50%' }}
        borderRadius={24}
      />
      <View>
        <Text className="text-lg font-medium">Relieve stress</Text>
        <Text className="font-light">Breathing practice</Text>
        <View className="h-4" />
        <View className="flex-row items-center gap-2">
          <FontAwesome6 name="hourglass-empty" size={16} color="black" />
          <Text className="font-medium">15 min</Text>
        </View>
      </View>
    </View>
  );
}
