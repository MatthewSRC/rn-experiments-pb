import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MusicplayerBackground } from './MusicplayerBackground';

export function Container({ children }: Props) {
  return (
    <View className="flex-1">
      <MusicplayerBackground />
      <SafeAreaView className="mb-20 flex-1">{children}</SafeAreaView>
    </View>
  );
}

interface Props {
  children: JSX.Element | JSX.Element[];
}
