import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import creations from 'mocks/muzaic/creations.json';
import { useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  useWindowDimensions,
  View,
  Text,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const CARD_PADDING_H = 4;
const CARD_SPACING = 4;

export function CreationsPage() {
  const { bottom } = useSafeAreaInsets();
  const [active, setActive] = useState<string | undefined>();

  function handleActiveToggle(id: string) {
    if (active === id) setActive(undefined);
    else setActive(id);
  }

  return (
    <FlatList
      style={{
        paddingHorizontal: CARD_PADDING_H,
      }}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<View className="h-6" />}
      ListFooterComponent={<View style={{ height: bottom + 70 + 24 }} />}
      ItemSeparatorComponent={() => <View style={{ height: CARD_SPACING }} />}
      data={creations as Creation[]}
      renderItem={({ item, index }) => (
        <CreationCard
          item={item}
          index={index}
          active={active}
          onPress={() => handleActiveToggle(item.id)}
        />
      )}
    />
  );
}

function CreationCard({ item, index, active, onPress }: CreationCardProps) {
  const { width } = useWindowDimensions();
  const side = (width - CARD_PADDING_H * 2 - CARD_SPACING) / 2;
  const progress = useSharedValue(0);
  const playing = active !== undefined && active === item.id;

  useEffect(() => {
    progress.value = withDelay(index * 250, withTiming(1, { duration: 1000 }));
  }, [index]);

  const rStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <AnimatedPressable style={rStyle} onPress={onPress}>
      <AnimatedImageBackground
        source={coverImages[item.cover]}
        style={{
          width: side,
          height: side,
          marginRight: index % 2 === 0 ? CARD_SPACING : 0,
          transitionProperty: 'opacity',
          transitionDuration: 500,
          opacity: active !== undefined && active !== item.id ? 0.5 : 1,
        }}
        borderRadius={side / 8}>
        <Animated.View
          style={{
            borderRadius: side / 8,
            borderColor: playing ? 'white' : '#171717',
            transitionProperty: 'borderColor',
            transitionDuration: 500,
            opacity: active !== undefined && active !== item.id ? 0.5 : 1,
          }}
          className="flex-1 border-[1px] px-6 py-3">
          <MaterialCommunityIcons
            name="dots-vertical"
            size={28}
            color="white"
            className="absolute right-4 top-4"
          />
          <Text className="absolute bottom-4 left-4 text-xl text-white">
            {item.title} {formatTime(item.duration)}
          </Text>
        </Animated.View>
      </AnimatedImageBackground>
    </AnimatedPressable>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || (hours > 0 && secs > 0)) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(' ');
}

interface CreationCardProps {
  item: Creation;
  index: number;
  active: string | undefined;
  onPress: () => void;
}

type Creation = {
  id: string;
  title: string;
  cover: string;
  duration: number;
};

const coverImages: { [key: string]: any } = {
  'yoga.jpg': require('assets/images/muzaic/yoga.jpg'),
  'running.jpg': require('assets/images/muzaic/running.jpg'),
  'gym.jpg': require('assets/images/muzaic/gym.jpg'),
  'energy.jpg': require('assets/images/muzaic/energy.jpg'),
  'relax.jpg': require('assets/images/muzaic/relax.jpg'),
  'sleep.jpg': require('assets/images/muzaic/sleep.jpg'),
};
