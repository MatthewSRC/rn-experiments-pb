import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Container } from 'components/musicplayer/Container';
import { View, Text, Image, useWindowDimensions } from 'react-native';

export default function Song() {
  const { width } = useWindowDimensions();
  const imageRes = width - 40 * 2 - 6 * 2;
  return (
    <Container>
      <View className="flex-1 justify-between p-10">
        <View className="flex-row justify-between">
          <Entypo name="chevron-thin-down" size={24} color="white" />
          <Text className="text-lg color-white">Dan Tucker: Into the Night</Text>
          <Entypo name="dots-three-horizontal" size={24} color="white" />
        </View>
        <View className="items-center justify-center rounded-3xl bg-white/15 p-3">
          <Image
            source={require('assets/images/musicplayer/galaxy.jpg')}
            style={{ width: imageRes, height: imageRes }}
            resizeMode="cover"
            className="rounded-xl"
          />
        </View>
        <View className="gap-3">
          <Text className="text-2xl font-bold color-white">Into the Night</Text>
          <Text className="text-xl color-white">Dan Tucker</Text>
        </View>
        <View className="gap-1">
          <View className="flex-1 flex-row items-center">
            <View className="h-1 w-2/3 rounded-sm bg-white" />
            <View className="-mr-1 h-3 w-3 rounded-md bg-white" />
            <View className="absolute h-1 w-full rounded-sm bg-white/50" />
          </View>
          <View className="w-full flex-row justify-between">
            <Text className="text-sm color-white">2:15</Text>
            <Text className="text-sm color-white">3:25</Text>
          </View>
          <View className="h-6" />
          <View className="flex-row items-center justify-around">
            <MaterialIcons name="skip-previous" size={48} color="white" />
            <MaterialIcons name="pause-circle" size={72} color="white" />
            <MaterialIcons name="skip-next" size={48} color="white" />
          </View>
        </View>
        <View className="flex-row justify-between ">
          <MaterialCommunityIcons name="monitor-speaker" size={24} color="white" />
          <Feather name="upload" size={24} color="white" />
        </View>
      </View>
    </Container>
  );
}
