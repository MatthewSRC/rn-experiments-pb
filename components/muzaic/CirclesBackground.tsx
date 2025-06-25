import { Canvas, Path, Group, vec, LinearGradient, Skia, Rect } from '@shopify/react-native-skia';
import React, { useState, useCallback, useEffect, useRef, useMemo, ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';
import {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedReaction,
  withSequence,
  withDelay,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

const SEGMENTS = 72;
const STEP_ANGLE = (Math.PI * 2) / SEGMENTS;
const NUM_WAVES_PER_CIRCLE = 5;
const MIN_RADIUS = 50;

const PULSE_DURATION = 600;
const MIN_PULSE_INTERVAL = 300;
const MAX_PULSE_INTERVAL = 2000;
const PULSE_MAGNITUDE = 0.05;
const PULSE_DELAY_BETWEEN_CIRCLES = 8;
const GRADIENT_COLORS = ['#ff9de2', '#e0aaff', '#b5ead7', '#7ed6df'];

type Point = {
  x: number;
  y: number;
};

type CircleConfig = {
  radius: number;
  baseStrokeWidth: number;
  index: number;
};

type CircleWaveValues = {
  positions: SharedValue<number>[];
  intensities: SharedValue<number>[];
};

type ConcentricCirclesProps = {
  skiaOther?: ReactNode;
};

function getCoords(centerX: number, centerY: number, angle: number, radius: number): Point {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

function useWaveSharedValues<T>(initialValues: T[]): SharedValue<T>[] {
  if (initialValues.length !== NUM_WAVES_PER_CIRCLE) {
    throw new Error(`Expected exactly ${NUM_WAVES_PER_CIRCLE} values for wave parameters`);
  }

  const value0 = useSharedValue(initialValues[0]);
  const value1 = useSharedValue(initialValues[1]);
  const value2 = useSharedValue(initialValues[2]);
  const value3 = useSharedValue(initialValues[3]);
  const value4 = useSharedValue(initialValues[4]);

  return [value0, value1, value2, value3, value4];
}

function useCirclePulseSharedValues<T>(initialValues: T[]): SharedValue<T>[] {
  if (initialValues.length !== 10) {
    throw new Error('Expected exactly 10 values for circle pulse parameters');
  }

  const value0 = useSharedValue(initialValues[0]);
  const value1 = useSharedValue(initialValues[1]);
  const value2 = useSharedValue(initialValues[2]);
  const value3 = useSharedValue(initialValues[3]);
  const value4 = useSharedValue(initialValues[4]);
  const value5 = useSharedValue(initialValues[5]);
  const value6 = useSharedValue(initialValues[6]);
  const value7 = useSharedValue(initialValues[7]);
  const value8 = useSharedValue(initialValues[8]);
  const value9 = useSharedValue(initialValues[9]);

  return [value0, value1, value2, value3, value4, value5, value6, value7, value8, value9];
}

function useWavePositions(): SharedValue<number>[] {
  const initialPositions = Array(NUM_WAVES_PER_CIRCLE)
    .fill(0)
    .map(() => Math.random() * Math.PI * 2);

  return useWaveSharedValues(initialPositions);
}

function useWaveIntensities(): SharedValue<number>[] {
  const initialIntensities = Array(NUM_WAVES_PER_CIRCLE).fill(0);

  return useWaveSharedValues(initialIntensities);
}

function useCircleWaveValues(): CircleWaveValues {
  const positions = useWavePositions();
  const intensities = useWaveIntensities();
  return { positions, intensities };
}

function usePulseValues(): SharedValue<number>[] {
  const initialPulseValues = Array(10).fill(0);

  return useCirclePulseSharedValues(initialPulseValues);
}

function useCircleConfigurations() {
  const { width, height } = useWindowDimensions();
  const maxScreenRadius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;

  const centerX = width / 2;
  const centerY = height / 2;

  return useMemo(() => {
    const maxRadius = maxScreenRadius * 1.05;
    const spacing = (maxRadius - MIN_RADIUS) / 9 / 1.2;

    const baseCircleRadii = Array(10)
      .fill(0)
      .map((_, i) => MIN_RADIUS + spacing * i)
      .reverse();

    const baseCircles = baseCircleRadii.map((radius, index) => ({
      radius,
      baseStrokeWidth: 1,
      index,
    }));

    const gradients = baseCircleRadii.map((radius) => ({
      start: vec(centerX - radius, centerY - radius),
      end: vec(centerX + radius, centerY + radius),
    }));

    return { baseCircles, gradients };
  }, []);
}

function useCircleWaveArrays() {
  const circle0 = useCircleWaveValues();
  const circle1 = useCircleWaveValues();
  const circle2 = useCircleWaveValues();
  const circle3 = useCircleWaveValues();
  const circle4 = useCircleWaveValues();
  const circle5 = useCircleWaveValues();
  const circle6 = useCircleWaveValues();
  const circle7 = useCircleWaveValues();
  const circle8 = useCircleWaveValues();
  const circle9 = useCircleWaveValues();

  const pulseValues = usePulseValues();

  const allCircles = [
    circle0,
    circle1,
    circle2,
    circle3,
    circle4,
    circle5,
    circle6,
    circle7,
    circle8,
    circle9,
  ];

  const wavePositionsArrays = useMemo(
    () => allCircles.map((circle) => circle.positions),
    [
      circle0.positions,
      circle1.positions,
      circle2.positions,
      circle3.positions,
      circle4.positions,
      circle5.positions,
      circle6.positions,
      circle7.positions,
      circle8.positions,
      circle9.positions,
    ]
  );

  const waveIntensitiesArrays = useMemo(
    () => allCircles.map((circle) => circle.intensities),
    [
      circle0.intensities,
      circle1.intensities,
      circle2.intensities,
      circle3.intensities,
      circle4.intensities,
      circle5.intensities,
      circle6.intensities,
      circle7.intensities,
      circle8.intensities,
      circle9.intensities,
    ]
  );

  return {
    allCircles,
    wavePositionsArrays,
    waveIntensitiesArrays,
    pulseValues,
  };
}

export function ConcentricCirclesBackground({ skiaOther }: ConcentricCirclesProps) {
  const { width, height } = useWindowDimensions();
  const centerX = width / 2;
  const centerY = height / 2;

  const [skiaPaths, setSkiaPaths] = useState<any[]>([]);

  const lastUpdateTime = useSharedValue(0);
  const pathsRef = useRef<string[]>([]);
  const pendingUpdate = useRef(false);
  const nextPulseTimeout = useRef<NodeJS.Timeout | null>(null);

  const { wavePositionsArrays, waveIntensitiesArrays, pulseValues } = useCircleWaveArrays();

  const wavePositionsRef = useRef(wavePositionsArrays);
  const waveIntensitiesRef = useRef(waveIntensitiesArrays);
  const pulseValuesRef = useRef(pulseValues);

  const { baseCircles, gradients } = useCircleConfigurations();

  const createRandomWavesCirclePath = useCallback(
    (
      radius: number,
      baseStrokeWidth: number,
      wavePositionsArray: number[],
      waveIntensitiesArray: number[]
    ): string => {
      let path = '';

      const controlPoints = new Array(SEGMENTS + 1);
      for (let i = 0; i <= SEGMENTS; i++) {
        const angle = i * STEP_ANGLE;
        let currentWidth = baseStrokeWidth;

        for (let w = 0; w < wavePositionsArray.length; w++) {
          const wavePos = wavePositionsArray[w];
          const waveIntensity = waveIntensitiesArray[w];

          const waveDist = Math.min(
            Math.abs(angle - wavePos),
            Math.abs(angle - wavePos + Math.PI * 2),
            Math.abs(angle - wavePos - Math.PI * 2)
          );

          const sigma = 0.4;
          const waveEffect = Math.exp(-(waveDist * waveDist) / (2 * sigma * sigma)) * waveIntensity;

          currentWidth += waveEffect * 12;
        }

        controlPoints[i] = currentWidth;
      }

      controlPoints[SEGMENTS] = controlPoints[0];
      path += 'M ';

      for (let i = 0; i <= SEGMENTS; i++) {
        const angle = i * STEP_ANGLE;
        const currentWidth = controlPoints[i];
        const point = getCoords(centerX, centerY, angle, radius + currentWidth / 2);

        path += `${point.x} ${point.y} `;
        if (i === 0) {
          path += 'L ';
        }
      }

      path += 'L ';
      for (let i = SEGMENTS; i >= 0; i--) {
        const angle = i * STEP_ANGLE;
        const currentWidth = controlPoints[i];
        const point = getCoords(centerX, centerY, angle, radius - currentWidth / 2);

        path += `${point.x} ${point.y} `;
        if (i === SEGMENTS) {
          path += 'L ';
        }
      }

      path += 'Z';
      return path;
    },
    []
  );

  const calculateCurrentCircles = useCallback((): CircleConfig[] => {
    const currentPulseValues = pulseValuesRef.current;

    return baseCircles.map((circle, idx) => {
      const pulseIdx = baseCircles.length - 1 - idx;

      const pulseFactor = 1 + currentPulseValues[pulseIdx].value * PULSE_MAGNITUDE;

      return {
        ...circle,
        radius: circle.radius * pulseFactor,
      };
    });
  }, [baseCircles]);

  const updatePathsRef = useCallback(
    (allPositions: number[][], allIntensities: number[][], timestamp: number) => {
      if (timestamp - lastUpdateTime.value < 33) {
        return;
      }

      lastUpdateTime.value = timestamp;

      const currentCircles = calculateCurrentCircles();

      const newPaths = currentCircles.map((circle, idx) => {
        return createRandomWavesCirclePath(
          circle.radius,
          circle.baseStrokeWidth,
          allPositions[idx],
          allIntensities[idx]
        );
      });

      pathsRef.current = newPaths;

      if (!pendingUpdate.current) {
        pendingUpdate.current = true;
        requestAnimationFrame(() => {
          const newSkiaPaths = pathsRef.current.map((pathStr) =>
            Skia.Path.MakeFromSVGString(pathStr)
          );

          setSkiaPaths(newSkiaPaths);
          pendingUpdate.current = false;
        });
      }
    },
    [calculateCurrentCircles, createRandomWavesCirclePath, lastUpdateTime]
  );

  const triggerWave = useCallback((circleIndex: number, waveIndex: number) => {
    const wavePositions = wavePositionsRef.current;
    const waveIntensities = waveIntensitiesRef.current;

    wavePositions[circleIndex][waveIndex].value = Math.random() * Math.PI * 2;

    waveIntensities[circleIndex][waveIndex].value = withSequence(
      withTiming(0.8 + Math.random() * 0.4, {
        duration: 300 + Math.random() * 200,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(0, {
        duration: 800 + Math.random() * 400,
        easing: Easing.inOut(Easing.quad),
      })
    );

    setTimeout(() => triggerWave(circleIndex, waveIndex), 1000 + Math.random() * 1500);
  }, []);

  const createMusicalPulse = useCallback(() => {
    const currentPulseValues = pulseValuesRef.current;
    const currentDuration = PULSE_DURATION + Math.random() * 3000;

    for (let i = 0; i < currentPulseValues.length; i++) {
      const delayMs = i * PULSE_DELAY_BETWEEN_CIRCLES;

      currentPulseValues[i].value = withDelay(
        delayMs,
        withSequence(
          withTiming(1, {
            duration: currentDuration / 2,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0, {
            duration: currentDuration / 2,
            easing: Easing.in(Easing.quad),
          })
        )
      );
    }

    const nextPulseTime =
      MIN_PULSE_INTERVAL + Math.random() * (MAX_PULSE_INTERVAL - MIN_PULSE_INTERVAL);

    if (nextPulseTimeout.current) {
      clearTimeout(nextPulseTimeout.current);
    }

    nextPulseTimeout.current = setTimeout(createMusicalPulse, nextPulseTime);
  }, []);

  useAnimatedReaction(
    () => {
      const wavePositions = wavePositionsRef.current;
      const waveIntensities = waveIntensitiesRef.current;
      const pulseValues = pulseValuesRef.current;

      const allPositions = wavePositions.map((wavePos) => wavePos.map((pos) => pos.value));
      const allIntensities = waveIntensities.map((waveInt) => waveInt.map((int) => int.value));

      const allPulseValues = pulseValues.map((pulse) => pulse.value);

      return {
        positions: allPositions,
        intensities: allIntensities,
        pulses: allPulseValues,
        timestamp: Date.now(),
      };
    },
    (animValues) => {
      runOnJS(updatePathsRef)(animValues.positions, animValues.intensities, animValues.timestamp);
    }
  );

  useEffect(() => {
    const wavePositions = wavePositionsRef.current;

    for (let c = 0; c < wavePositions.length; c++) {
      for (let w = 0; w < wavePositions[c].length; w++) {
        setTimeout(() => triggerWave(c, w), 500 + c * 200 + w * 100);
      }
    }

    const allPositions = wavePositions.map((wavePos) => wavePos.map((pos) => pos.value));
    const allIntensities = waveIntensitiesRef.current.map((waveInt) =>
      waveInt.map((int) => int.value)
    );

    updatePathsRef(allPositions, allIntensities, 0);

    const initialPulseDelay = 1000 + Math.random() * 2000;
    nextPulseTimeout.current = setTimeout(createMusicalPulse, initialPulseDelay);

    return () => {
      if (nextPulseTimeout.current) {
        clearTimeout(nextPulseTimeout.current);
      }
    };
  }, [triggerWave, updatePathsRef, createMusicalPulse]);

  return (
    <View style={{ position: 'absolute', width, height }}>
      <Canvas style={{ flex: 1 }}>
        <Group>
          <Rect x={0} y={0} width={width} height={height} color="black" />
          {skiaPaths.map(
            (path, index) =>
              path && (
                <Path key={index} path={path} style="fill">
                  <LinearGradient
                    colors={GRADIENT_COLORS}
                    start={gradients[index].start}
                    end={gradients[index].end}
                  />
                </Path>
              )
          )}
        </Group>
        {skiaOther}
      </Canvas>
    </View>
  );
}
