import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ConnectionPanel } from 'components/vpn/ConnectionPanel';
import { GlobeVisualization } from 'components/vpn/GlobeVisualization';
import { InfoPanel } from 'components/vpn/InfoPanel';
import { ConnectionState } from 'components/vpn/types';
import { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRive } from 'rive-react-native';

function Header() {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return (
    <Animated.View
      style={headerAnimatedStyle}
      className="flex-row items-center justify-between px-4">
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
        <MaterialIcons name="hexagon" size={24} color="white" />
        <MaterialIcons name="hexagon" size={8} color="#1e293b" className="absolute" />
      </View>
      <Text className="text-4xl text-white" style={{ letterSpacing: 12 }}>
        ARGUS
      </Text>
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
        <AntDesign name="star" size={20} color="yellow" />
      </View>
    </Animated.View>
  );
}

function Footer() {
  const footerOpacity = useSharedValue(0);
  const footerTranslateY = useSharedValue(30);

  useEffect(() => {
    footerOpacity.value = withDelay(
      1800,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    footerTranslateY.value = withDelay(
      1800,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerTranslateY.value }],
  }));

  return (
    <Animated.View
      style={footerAnimatedStyle}
      className="absolute bottom-6 -z-10 items-center gap-6 self-center">
      <Text className="text-xl font-semibold text-white">Your connection is protected</Text>
      <Text className=" text-slate-700">ver. 1.0.5</Text>
    </Animated.View>
  );
}

export default function Vpn() {
  const [setGlobeRef, globeRef] = useRive();
  const [setConnectRef, connectRef] = useRive();
  const { height, width } = useWindowDimensions();
  const scaleGlobe = useSharedValue(1);
  const translateGlobe = useSharedValue(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  function updateConnectionState(machineState: number, connectionState: ConnectionState) {
    if (!connectRef) return;
    setConnectionState(connectionState);
    connectRef.setInputState('State Machine 1', 'state', machineState);
  }

  function updateGlobeState(machineState: number) {
    if (!globeRef) return;
    globeRef.setInputState('State Machine 1', 'state', machineState);
  }

  async function updateState() {
    if (!connectRef || !globeRef) return;
    const ms = await connectRef.getNumberState('state');

    switch (ms) {
      case 0:
        scaleGlobe.value = withSequence(
          withTiming(0.9, { duration: 250, easing: Easing.cubic }),
          withTiming(1, { duration: 250, easing: Easing.cubic })
        );
        updateConnectionState(1, 'connecting');

        setTimeout(() => updateConnectionState(2, 'connecting'), 1000);

        setTimeout(() => {
          updateConnectionState(3, 'connected');
          translateGlobe.value = withTiming(1, { duration: 750, easing: Easing.cubic });
          updateGlobeState(1);
          setTimeout(() => updateGlobeState(2), 1000);
        }, 5000);

        setTimeout(() => updateConnectionState(4, 'connected'), 6000);
        break;

      case 4:
        updateConnectionState(1, 'disconnecting');
        translateGlobe.value = withTiming(0, { duration: 1000, easing: Easing.cubic });
        setTimeout(() => updateConnectionState(0, 'disconnected'), 1000);

        updateGlobeState(1);
        setTimeout(() => updateGlobeState(0), 1000);
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-between bg-slate-950">
      <Header />
      <InfoPanel connectionState={connectionState} translateGlobe={translateGlobe} />
      <View className="w-full">
        <GlobeVisualization
          connectionState={connectionState}
          updateState={updateState}
          height={height}
          width={width}
          scaleGlobe={scaleGlobe}
          translateGlobe={translateGlobe}
          setGlobeRef={setGlobeRef}
          setConnectRef={setConnectRef}
        />
        <ConnectionPanel connectionState={connectionState} translateGlobe={translateGlobe} />
      </View>
      <Footer />
    </SafeAreaView>
  );
}
