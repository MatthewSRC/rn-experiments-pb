import { useRouter } from 'expo-router';
import { Pressable, View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-black">
      <Pressable
        onPress={() => router.navigate('musicplayer')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Music player</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('finance')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Finance</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('muzaic/mood')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Muzaic</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('exito')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Exito</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('mentalhealth')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Mental Health</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('gyrocard')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Gyrocard</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('vpn')}
        className="h-12 w-40 items-center justify-center rounded-lg bg-white">
        <Text className="text-lg font-bold color-black">Vpn</Text>
      </Pressable>
    </View>
  );
}
