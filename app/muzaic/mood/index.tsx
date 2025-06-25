import { MoodDisplay } from 'components/muzaic/MoodDisplay';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Mood() {
  const [selected, setSelected] = useState<number | null>();
  const router = useRouter();

  function handlePress(id: number) {
    setSelected(id);
  }

  function handleNext() {
    router.replace('/muzaic/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10 pt-0">
      <View className="flex-row justify-between px-8">
        <View className="w-4" />
        <Pressable onPress={handleNext}>
          <Text className="color-white">Skip</Text>
        </Pressable>
      </View>
      <View className="gap-2 px-8">
        <Text className="text-5xl font-light color-white">How do you feel now?</Text>
        <Text className=" max-w-[80%] font-light tracking-widest color-white " numberOfLines={2}>
          Choose which way you are feeling at the moment
        </Text>
      </View>
      <MoodDisplay
        topLeftComponent={
          <MoodSelector
            selected={selected === 0}
            mood={moods[0]}
            onPress={handlePress}
            size="small"
          />
        }
        middleLeftComponent={
          <MoodSelector
            selected={selected === 1}
            mood={moods[1]}
            onPress={handlePress}
            size="big"
          />
        }
        bottomLeftComponent={
          <MoodSelector
            selected={selected === 2}
            mood={moods[2]}
            onPress={handlePress}
            size="small"
          />
        }
        centerComponent={
          <MoodSelector
            selected={selected === 3}
            mood={moods[3]}
            onPress={handlePress}
            size="small"
          />
        }
        bottomMiddleComponent={
          <MoodSelector
            selected={selected === 4}
            mood={moods[4]}
            onPress={handlePress}
            size="big"
          />
        }
        topRightComponent={
          <MoodSelector
            selected={selected === 5}
            mood={moods[5]}
            onPress={handlePress}
            size="small"
          />
        }
        middleRightComponent={
          <MoodSelector
            selected={selected === 6}
            mood={moods[6]}
            onPress={handlePress}
            size="big"
          />
        }
        bottomRightComponent={
          <MoodSelector
            selected={selected === 7}
            mood={moods[7]}
            onPress={handlePress}
            size="small"
          />
        }
      />
      <View className="px-8">
        <Pressable
          onPress={handleNext}
          className="h-16 w-full items-center justify-center rounded-full bg-neutral-800">
          <Text className="color-white">Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MoodSelector({ onPress, size, mood, selected }: Props) {
  const { width } = useWindowDimensions();

  const DIMENSION = size === 'small' ? width / 4 : width / 3;
  const RADIUS = size === 'small' ? width / 4 / 2 : width / 3 / 2;
  /*const progress = useSharedValue(size === 'small' ? 44 : 58);

  useEffect(() => {
    if (selected) progress.value = withTiming(100, { duration: 1000 });
    else progress.value = withTiming(size === 'small' ? 44 : 58, { duration: 250 });
  });

  const blur = useDerivedValue(() => {
    return progress.value;
  });*/

  return (
    <Pressable
      style={{
        width: DIMENSION,
        height: DIMENSION,
        borderRadius: RADIUS,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => onPress(mood.id)}>
      {/*
      <Canvas
        style={{
          position: 'absolute',
          width: DIMENSION + GAP - 4,
          height: DIMENSION + GAP - 3,
        }}>
        <Group
          layer={
            <Paint>
              <Blur blur={blur} />
              <ColorMatrix matrix={[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, -1]} />
            </Paint>
          }>
          <RoundedRect
            x={GAP / 2}
            y={GAP / 2}
            width={DIMENSION}
            height={DIMENSION}
            color="black"
            r={RADIUS}
          />
        </Group>
      </Canvas>
    */}
      <Animated.Text
        className="text-lg font-medium color-white"
        style={{
          transitionDuration: 200,
          transform: [{ scale: selected ? 1.1 : 0.85 }],
          transitionProperty: ['opacity', 'transform'],
          opacity: selected ? 1 : 0.75,
        }}>
        {mood.label}
      </Animated.Text>
    </Pressable>
  );
}

interface Props {
  onPress: (id: number) => void;
  size: 'big' | 'small';
  mood: { id: number; label: string };
  selected: boolean;
}

const moods = [
  {
    id: 0,
    label: 'Anxious',
  },
  {
    id: 1,
    label: 'Sad',
  },
  {
    id: 2,
    label: 'Angry',
  },
  {
    id: 3,
    label: 'Indifferent',
  },
  {
    id: 4,
    label: 'Lethargic',
  },
  {
    id: 5,
    label: 'Energetic',
  },
  {
    id: 6,
    label: 'Happy',
  },
  {
    id: 7,
    label: 'Chill',
  },
];
