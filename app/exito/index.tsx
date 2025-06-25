import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FirstView } from 'components/exito/FirstView';
import { FourthView } from 'components/exito/FourthView';
import { ScrollKeyframe } from 'components/exito/ScrollKeyframe';
import { ScrollTimeline } from 'components/exito/ScrollTimeline';
import { SecondView } from 'components/exito/SecondView';
import { ThirdView } from 'components/exito/ThirdView';
import { useWindowDimensions, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const NAVBAR_HEIGHT = 80;

export default function Index() {
  const { height } = useWindowDimensions();
  return (
    <SafeAreaView className="flex-1">
      <View style={{ height: NAVBAR_HEIGHT }} className="z-10 w-full px-6 py-3">
        <View className="h-full w-full flex-row items-center justify-between rounded-full bg-gray-200 px-6">
          <View className="flex-row gap-2">
            <Feather name="activity" size={24} color="black" />
            <Text className="text-2xl font-bold">EXITO</Text>
          </View>
          <FontAwesome5 name="grip-lines" size={24} color="black" />
        </View>
      </View>
      <ScrollTimeline length={height * 6}>
        <ScrollKeyframe position={{ start: 0, end: height }}>
          <FirstView />
        </ScrollKeyframe>
        <ScrollKeyframe position={{ start: height + height / 2, end: height * 2 + height / 2 }}>
          <SecondView />
        </ScrollKeyframe>
        <ScrollKeyframe position={{ start: height * 3, end: height * 4 }}>
          <ThirdView />
        </ScrollKeyframe>
        <ScrollKeyframe position={{ start: height * 4 + height / 2, end: height * 6 }}>
          <FourthView />
        </ScrollKeyframe>
      </ScrollTimeline>
    </SafeAreaView>
  );
}
