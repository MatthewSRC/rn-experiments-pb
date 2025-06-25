import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MultiTab, TabPage } from 'components/common/MultiTab';
import { CreationsPage } from 'components/muzaic/profile/CreationsPage';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900 pt-6">
      <View className="flex-row justify-between px-6">
        <View className="w-10" />
        <Image
          source={require('assets/images/muzaic/mark.png')}
          className="h-24 w-24 rounded-full"
        />
        <View className="h-10 w-10 items-center justify-center">
          <MaterialCommunityIcons
            name="hexagon-outline"
            size={28}
            color="white"
            style={{ position: 'absolute' }}
          />
          <MaterialCommunityIcons
            name="hexagon-outline"
            size={14}
            color="white"
            style={{ position: 'absolute' }}
          />
        </View>
      </View>
      <View className="h-4" />
      <Text className="text-center text-4xl text-white">Mark Hantry</Text>
      <View className="h-6" />
      <View className="flex-row items-center justify-around px-6">
        <View className="items-center">
          <Text className="text-2xl text-white">654</Text>
          <Text className="text-sm text-white/60">Total minutes</Text>
        </View>
        <View className="h-2/3 w-[1px] bg-white/30" />
        <View className="items-center">
          <Text className="text-2xl text-white">23</Text>
          <Text className="text-sm text-white/60">Day streak</Text>
        </View>
        <View className="h-2/3 w-[1px] bg-white/30" />
        <View className="items-center">
          <Text className="text-2xl text-white">56</Text>
          <Text className="text-sm text-white/60">Finished sessions</Text>
        </View>
      </View>
      <View className="h-10" />
      <View className="w-full">
        <Pressable className="z-10">
          <Feather name="filter" size={18} color="white" className="absolute right-6 mt-1" />
        </Pressable>
      </View>
      <MultiTab
        flexRail
        paddingH={24}
        tabTitleStyle={() => ({ fontWeight: 'regular', fontSize: 18, paddingBottom: 16 })}>
        <TabPage id={0} title="My creations">
          <CreationsPage />
        </TabPage>
        <TabPage id={1} title="Favourites">
          <CreationsPage />
        </TabPage>
      </MultiTab>
    </SafeAreaView>
  );
}
