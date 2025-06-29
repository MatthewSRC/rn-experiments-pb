import { MetallicColorSelector } from 'components/gyrocard/MetallicColorSelector';
import { PressedText } from 'components/gyrocard/PressedText';
import { SnapCarousel, SnapCarouselRef } from 'components/gyrocard/SnapCarousel';
import { MetallicCard } from 'components/gyrocard/metalliccard/MetallicCard';
import { METALLIC_COLORS } from 'components/gyrocard/metalliccard/constants';
import { MetallicType } from 'components/gyrocard/metalliccard/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const METALLIC_TYPES = Object.keys(METALLIC_COLORS) as MetallicType[];

export default function Home() {
  const snapCarouselRef = useRef<SnapCarouselRef>(null);
  const [selectedMetallic, setSelectedMetallic] = useState<MetallicType>('chrome');

  const handleMetallicSelect = (type: MetallicType) => {
    setSelectedMetallic(type);
    const index = METALLIC_TYPES.indexOf(type);
    if (index !== -1 && snapCarouselRef.current) {
      snapCarouselRef.current.snapToIndex(index);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 py-8">
        <Animated.View entering={FadeIn.delay(400).springify()} className="mb-8 items-center">
          <View className="items-center">
            <Animated.View
              key={selectedMetallic}
              entering={FadeIn.duration(750)}
              exiting={FadeOut.duration(200)}
              className="items-center">
              <PressedText
                metallicType={selectedMetallic}
                fontSize={50}
                fontWeight="300"
                style={{
                  letterSpacing: 2,
                  textAlign: 'center' as const,
                  marginBottom: 8,
                }}>
                {selectedMetallic.charAt(0).toUpperCase() + selectedMetallic.slice(1)}
              </PressedText>
            </Animated.View>
            <Animated.View
              key={`${selectedMetallic}-edition`}
              entering={FadeIn.delay(200).duration(1000)}
              exiting={FadeOut.duration(200)}>
              <Text className="mx-3 text-lg font-light tracking-[3px] text-gray-400">
                LIMITED EDITION
              </Text>
            </Animated.View>

            <Animated.View
              key={`${selectedMetallic}-dots`}
              entering={FadeIn.delay(400).duration(1250)}
              exiting={FadeOut.duration(200)}
              className="mt-3 flex-row gap-4">
              <View className="h-1 w-1 rounded-full bg-white/40" />
              <View className="h-1 w-1 rounded-full bg-white/20" />
              <View className="h-1 w-1 rounded-full bg-white/40" />
            </Animated.View>
          </View>
        </Animated.View>

        <SnapCarousel
          ref={snapCarouselRef}
          lazyLoad
          lazyLoadThreshold={0.35}
          animationDuration={2500}
          onIndexChange={(index) => {
            if (METALLIC_TYPES[index]) {
              setSelectedMetallic(METALLIC_TYPES[index]);
            }
          }}
          items={METALLIC_TYPES.map((metal) => (
            <DisplayCard key={metal} metal={metal} />
          ))}
        />

        <Animated.View entering={FadeInDown.delay(800).springify()} className="mb-8">
          <Text className="mb-4 text-center text-sm font-medium tracking-wider text-gray-400">
            CARD FINISH
          </Text>
          <View className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-4">
            <MetallicColorSelector
              selectedType={selectedMetallic}
              onSelect={handleMetallicSelect}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000)}>
          <Pressable className="mx-8 bg-white py-4">
            <Text className="text-center text-lg font-semibold tracking-wide text-black">
              Continue with {selectedMetallic.charAt(0).toUpperCase() + selectedMetallic.slice(1)}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function DisplayCard({ metal }: { metal: MetallicType }) {
  return (
    <MetallicCard borderRadius={12} motionIntensity="controlled" metallicType={metal}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(0,0,0,0.1)']}
        style={{ flex: 1, padding: 16 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="mb-8 flex-row items-start justify-between">
          <View>
            <PressedText metallicType={metal} fontSize={24} fontWeight="700">
              Card
            </PressedText>
            <Text className="mt-1 text-xs tracking-widest text-white/60">LIMITED EDITION</Text>
          </View>
          <View className="items-end">
            <PressedText metallicType={metal} fontSize={18} fontWeight="500">
              {metal.charAt(0).toUpperCase() + metal.slice(1)}
            </PressedText>
            <View className="mt-2 h-8 w-8 rounded-full bg-white/20" />
          </View>
        </View>

        <View className="flex-1 justify-center">
          <PressedText
            metallicType={metal}
            fontSize={20}
            fontWeight="400"
            style={{ letterSpacing: 3 }}>
            1234 5678 9012 3456
          </PressedText>
        </View>

        <View className="flex-row items-end justify-between">
          <View>
            <Text className="mb-1 text-xs tracking-wider text-white/50">CARDHOLDER</Text>
            <PressedText metallicType={metal} fontSize={16} fontWeight="500">
              Adam Smith
            </PressedText>
          </View>
          <View className="items-end">
            <Text className="mb-1 text-xs tracking-wider text-white/50">EXPIRES</Text>
            <PressedText metallicType={metal} fontSize={16} fontWeight="400">
              08/32
            </PressedText>
          </View>
        </View>

        <View className="absolute bottom-2 left-6 h-2 w-2 rounded-full bg-white/40" />
      </LinearGradient>
    </MetallicCard>
  );
}
