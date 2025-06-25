import AntDesign from '@expo/vector-icons/AntDesign';
import { IntensityChart } from 'components/muzaic/IntensityChart';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function ControlModal() {
  const router = useRouter();
  return (
    <View className="absolute bottom-0 w-full bg-neutral-900 px-1 py-6">
      <Pressable className="ml-6 h-8 w-8" onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>
      <View className="h-6" />
      <Text className="px-6 text-4xl text-white">Control</Text>
      <View className="h-4" />
      <View className="max-w-[80%]">
        <Text className="px-6 text-white">
          Configure the motive settings for the current session
        </Text>
      </View>
      <View className="h-10" />
      <View className="rounded-3xl bg-neutral-800/50 py-4">
        <Text className="absolute left-6 top-6 text-sm font-light text-white/75">intense</Text>
        <Text className="absolute bottom-20 left-6 text-sm font-light text-white/75">relaxed</Text>
        <IntensityChart />
      </View>
      <View className="h-10" />
      <Pressable className="w-11/12 items-center justify-center self-center rounded-full bg-white py-5">
        <Text className="text-lg font-medium">Apply controls</Text>
      </Pressable>
    </View>
  );
}
