import {
  Canvas,
  SkImage,
  Image,
  makeImageFromView,
  vec,
  dist,
  Circle,
  ImageShader,
  mix,
} from '@shopify/react-native-skia';
import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SharedValue, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

interface ScreenViewState {
  overlay1: SkImage | null;
  overlay2: SkImage | null;
  active: boolean;
}

type ScreenViewAction = Partial<ScreenViewState>;

interface ScreenViewContextType extends ScreenViewState {
  ref: RefObject<View>;
  dispatch: Dispatch<ScreenViewAction>;
  transition: SharedValue<number>;
  circle: SharedValue<{ x: number; y: number; r: number }>;
}

const defaultValue = {
  overlay1: null,
  overlay2: null,
  dispatch: () => null,
  active: false,
};

const ScreenViewContext = createContext<ScreenViewContextType | null>(null);

const screenViewReducer = (state: ScreenViewState, action: ScreenViewAction): ScreenViewState => {
  return { ...state, ...action };
};

export function ScreenViewProvider({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const ref = useRef<View>(null);
  const [{ overlay1, overlay2, active }, dispatch] = useReducer(screenViewReducer, defaultValue);
  const transition = useSharedValue(0);
  const circle = useSharedValue({ x: 0, y: 0, r: 0 });
  const r = useDerivedValue(() => {
    return mix(transition.value, 0, circle.value.r);
  });
  const c = useDerivedValue(() => {
    return { x: circle.value.x, y: circle.value.y };
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }} ref={ref} collapsable={false}>
        <ScreenViewContext.Provider
          value={{ ref, overlay1, overlay2, dispatch, transition, circle, active }}>
          {children}
        </ScreenViewContext.Provider>
      </View>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Canvas style={{ flex: 1 }}>
          <Image image={overlay1} x={0} y={-12} width={width} height={height} />
          {overlay2 && (
            <Circle c={c} r={r}>
              <ImageShader
                image={overlay2}
                x={0}
                y={-12}
                width={width}
                height={height}
                fit="contain"
              />
            </Circle>
          )}
        </Canvas>
      </View>
    </View>
  );
}

export function useScreenView() {
  const { width, height } = useWindowDimensions();
  const corners = [vec(0, 0), vec(width, 0), vec(width, height), vec(0, height)];
  const context = useContext(ScreenViewContext);
  if (context === null) {
    throw new Error('No context found');
  }
  const { ref, dispatch, circle, transition, active } = context;

  const navigate = useCallback(
    async (position: { x: number; y: number }, execute: () => void) => {
      dispatch({ active: true, overlay1: null, overlay2: null });
      circle.value = {
        x: position.x,
        y: position.y,
        r: Math.max(...corners.map((c) => dist(c, vec(position.x, position.y)))),
      };
      const overlay1 = await makeImageFromView(ref);
      dispatch({ overlay1, overlay2: null });
      await wait(10);
      execute();
      await wait(100);
      const overlay2 = await makeImageFromView(ref);
      dispatch({ overlay1, overlay2 });
      transition.value = 0;
      transition.value = withTiming(1, { duration: 650 });
      await wait(650);
      dispatch({ active: false, overlay1: null, overlay2: null });
    },
    [ref, dispatch]
  );

  return { navigate, active };
}

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
