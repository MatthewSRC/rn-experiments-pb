import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SkPath, Skia, BackdropBlur } from '@shopify/react-native-skia';
import { DynamicText } from 'components/common/DynamicText';
import { ConcentricCirclesBackground } from 'components/muzaic/CirclesBackground';
import { useRouter } from 'expo-router';
import { BackgroundTimer } from 'helpers/backgroundTimer';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Song() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [paused, setPaused] = useState<boolean>(false);
  const [status, setStatus] = useState<undefined | 0 | 1>();

  return (
    <View className="flex-1">
      <ConcentricCirclesBackground
        skiaOther={
          <>
            <TimerBackground top={top} width={width} />
            <ButtonAddBackground top={top} width={width} />
            <SongCardBackground bottom={bottom} width={width} height={height} />
          </>
        }
      />
      <TimerOverlay paused={paused} top={top} width={width} />
      <ButtonAddOverlay top={top} />
      <SongCardOverlay
        bottom={bottom}
        width={width}
        height={height}
        onTimerPress={() => router.navigate('muzaic/(tabs)/song/timerModal')}
        onControlPress={() => router.navigate('muzaic/(tabs)/song/controlModal')}
      />
      <PauseLikeDislikeButton
        height={height}
        paused={paused}
        status={status}
        onTogglePause={() => setPaused((ps) => !ps)}
        onStatusChange={(newStatus) => setStatus(newStatus)}
      />
    </View>
  );
}

const PAUSE_BUTTON_DIMENSION = 32;
function PauseLikeDislikeButton({
  height,
  paused,
  status,
  onTogglePause,
  onStatusChange,
}: {
  height: number;
  paused: boolean;
  status: undefined | 0 | 1;
  onTogglePause: () => void;
  onStatusChange: (status: undefined | 0 | 1) => void;
}) {
  function handleStatusChange(reaction: 0 | 1) {
    onStatusChange(status === reaction ? undefined : reaction);
  }

  return (
    <View
      style={{ top: height / 2 - PAUSE_BUTTON_DIMENSION }}
      className="absolute flex-row items-center gap-6 self-center">
      <Pressable onPress={() => handleStatusChange(0)} className="mt-3">
        <Animated.View
          style={{
            opacity: status === 0 ? 0 : 1,
            transitionProperty: 'opacity',
            transitionDelay: status === 0 ? 250 : 0,
            position: status === 0 ? 'absolute' : 'relative',
          }}>
          <AntDesign name="dislike2" size={24} color="white" />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ scale: status === 0 ? 1 : 0 }],
            transitionDuration: 250,
            transitionProperty: 'transform',
            position: status !== 0 ? 'absolute' : 'relative',
          }}>
          <AntDesign name="dislike1" size={24} color="white" />
        </Animated.View>
      </Pressable>
      <Pressable
        onPress={onTogglePause}
        className="h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
        <Animated.View
          style={{
            transform: [{ scale: paused ? 0 : 1 }],
            transitionDuration: 150,
            transitionProperty: 'transform',
            transitionDelay: paused ? 0 : 150,
          }}
          className="absolute">
          <SimpleLineIcons name="control-pause" size={16} color="white" />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ scale: paused ? 1 : 0 }],
            transitionDuration: 150,
            transitionProperty: 'transform',
            transitionDelay: paused ? 150 : 0,
          }}
          className="absolute">
          <FontAwesome name="play" size={16} color="white" />
        </Animated.View>
      </Pressable>
      <Pressable onPress={() => handleStatusChange(1)} className="mb-3">
        <Animated.View
          style={{
            opacity: status === 1 ? 0 : 1,
            transitionProperty: 'opacity',
            transitionDelay: status === 1 ? 250 : 0,
            position: status === 1 ? 'absolute' : 'relative',
          }}>
          <AntDesign name="like2" size={24} color="white" />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ scale: status === 1 ? 1 : 0 }],
            transitionDuration: 250,
            transitionProperty: 'transform',
            position: status !== 1 ? 'absolute' : 'relative',
          }}>
          <AntDesign name="like1" size={24} color="white" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const TOP_PADDING = 8;
const RIGHT_PADDING = 8;

const TIMER_CARD_WIDTH = 80;
const TIMER_CARD_HEIGHT = 28;

const BUTTON_ADD_DIMENSION = 48;

function ButtonAddOverlay({ top }: { top: number }) {
  return (
    <View
      style={{
        right: RIGHT_PADDING,
        top: top + TOP_PADDING,
        width: BUTTON_ADD_DIMENSION,
        height: BUTTON_ADD_DIMENSION,
      }}
      className="absolute items-center justify-center rounded-full">
      <Entypo name="plus" size={20} color="white" />
    </View>
  );
}

function ButtonAddBackground({ top, width }: { top: number; width: number }) {
  const buttonBg: SkPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addRRect({
      rect: {
        x: width - BUTTON_ADD_DIMENSION - RIGHT_PADDING,
        y: top + TOP_PADDING,
        width: BUTTON_ADD_DIMENSION,
        height: BUTTON_ADD_DIMENSION,
      },
      bottomLeft: { x: BUTTON_ADD_DIMENSION, y: BUTTON_ADD_DIMENSION },
      bottomRight: { x: BUTTON_ADD_DIMENSION, y: BUTTON_ADD_DIMENSION },
      topLeft: { x: BUTTON_ADD_DIMENSION, y: BUTTON_ADD_DIMENSION },
      topRight: { x: BUTTON_ADD_DIMENSION, y: BUTTON_ADD_DIMENSION },
    });
    path.close();
    return path;
  }, []);
  return <BackdropBlur blur={10} clip={buttonBg} />;
}

function TimerOverlay({ paused, top, width }: { paused: boolean; top: number; width: number }) {
  const [timer, setTimer] = useState<number>(0);
  const backgroundTimer = new BackgroundTimer('song', false, (value) => setTimer(value));

  useEffect(() => {
    if (!paused) {
      backgroundTimer.start(timer, 1, 1000);
    } else {
      backgroundTimer.stop();
    }
    return () => backgroundTimer.stop();
  }, [paused]);

  return (
    <View
      style={{
        left: width / 2 - TIMER_CARD_WIDTH / 2,
        top: top + TOP_PADDING + BUTTON_ADD_DIMENSION / 2 - TIMER_CARD_HEIGHT / 2,
        width: TIMER_CARD_WIDTH,
        height: TIMER_CARD_HEIGHT,
      }}
      className="absolute items-center justify-center rounded-full">
      <DynamicText style={{ color: 'white' }}>
        {`${Math.floor(timer / 60)
          .toString()
          .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
      </DynamicText>
    </View>
  );
}

function TimerBackground({ top, width }: { top: number; width: number }) {
  const timerBg: SkPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addRRect({
      rect: {
        x: width / 2 - TIMER_CARD_WIDTH / 2,
        y: top + TOP_PADDING + BUTTON_ADD_DIMENSION / 2 - TIMER_CARD_HEIGHT / 2,
        width: TIMER_CARD_WIDTH,
        height: TIMER_CARD_HEIGHT,
      },
      bottomLeft: { x: 40, y: 40 },
      bottomRight: { x: 40, y: 40 },
      topLeft: { x: 40, y: 40 },
      topRight: { x: 40, y: 40 },
    });
    path.close();
    return path;
  }, []);
  return <BackdropBlur blur={10} clip={timerBg} />;
}

const TAB_HEIGHT = 70;
const BOTTOM_PADDING = 40;
const HORIZONTAL_PADDING = 8;
const CARD_HEIGHT = 148;

function SongCardOverlay({
  bottom,
  width,
  height,
  onTimerPress,
  onControlPress,
}: {
  bottom: number;
  width: number;
  height: number;
  onTimerPress: () => void;
  onControlPress: () => void;
}) {
  return (
    <View
      style={{
        top: height - bottom - TAB_HEIGHT - CARD_HEIGHT - BOTTOM_PADDING,
        width: width - HORIZONTAL_PADDING,
        height: CARD_HEIGHT,
      }}
      className="absolute mx-2 gap-4 rounded-[40px] px-1 py-3">
      <View className="flex-row justify-between px-5">
        <View>
          <Text className=" text-xl font-medium text-white">Sleep</Text>
          <Text className=" text-lg text-white">Relaxation</Text>
        </View>
        <MaterialIcons name="restart-alt" size={28} color="white" />
      </View>
      <View className="w-full flex-row gap-1 rounded-full bg-neutral-900 p-1">
        <View className="h-16 w-1/3 items-center justify-center rounded-full bg-neutral-800">
          <MaterialCommunityIcons name="bookshelf" size={24} color="white" />
        </View>
        <View className="flex-1 flex-row gap-1">
          <View className="h-16 flex-1 items-center justify-center rounded-full bg-neutral-800">
            <Feather name="music" size={20} color="white" />
          </View>
          <Pressable
            onPress={onControlPress}
            className="h-16 flex-1 items-center justify-center rounded-full bg-neutral-800">
            <FontAwesome6 name="sliders" size={20} color="white" />
          </Pressable>
          <Pressable
            onPress={onTimerPress}
            className="h-16 flex-1 items-center justify-center rounded-full bg-neutral-800">
            <Ionicons name="timer-outline" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SongCardBackground({
  bottom,
  width,
  height,
}: {
  bottom: number;
  width: number;
  height: number;
}) {
  const songCard: SkPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addRRect({
      rect: {
        x: HORIZONTAL_PADDING,
        y: height - bottom - TAB_HEIGHT - CARD_HEIGHT - BOTTOM_PADDING,
        width: width - HORIZONTAL_PADDING * 2,
        height: CARD_HEIGHT,
      },
      bottomLeft: { x: 40, y: 40 },
      bottomRight: { x: 40, y: 40 },
      topLeft: { x: 40, y: 40 },
      topRight: { x: 40, y: 40 },
    });
    path.close();
    return path;
  }, []);
  return <BackdropBlur blur={6} clip={songCard} />;
}
