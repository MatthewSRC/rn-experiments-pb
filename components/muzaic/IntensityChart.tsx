import { Canvas, Path, LinearGradient, vec, Circle, Group, Line } from '@shopify/react-native-skia';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS, SharedValue } from 'react-native-reanimated';

type ControlPoint = {
  x: number;
  y: number;
};

type AnimatedControlPoint = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  originalX: number;
};

const PADDING = 20;
const CONTROL_POINT_RADIUS = 10;
const ACTIVE_CONTROL_POINT_RADIUS = 15;
const TOUCH_RADIUS = 30;
const MIN_POINT_SPACING = 5;
const DEFAULT_MAX_TIME = 30;
const DEFAULT_COLORS = [
  'rgba(249, 115, 22, 0.75)',
  'rgba(225, 29, 72, 0.5)',
  'rgba(79, 15, 97, 0.25)',
  'transparent',
];
const DEFAULT_POINTS = [
  { x: 0, y: 0.4 },
  { x: 10, y: 0.6 },
  { x: 15, y: 0.4 },
  { x: 20, y: 0.8 },
  { x: 30, y: 0.6 },
];

function useAnimatedControlPoints(
  initialPoints: ControlPoint[],
  mapToScreen: (point: ControlPoint) => { x: number; y: number }
): AnimatedControlPoint[] {
  const screenPoints = initialPoints.map((point) => mapToScreen(point));

  const point0x = useSharedValue(screenPoints[0].x);
  const point0y = useSharedValue(screenPoints[0].y);

  const point1x = useSharedValue(screenPoints[1].x);
  const point1y = useSharedValue(screenPoints[1].y);

  const point2x = useSharedValue(screenPoints[2].x);
  const point2y = useSharedValue(screenPoints[2].y);

  const point3x = useSharedValue(screenPoints[3].x);
  const point3y = useSharedValue(screenPoints[3].y);

  const point4x = useSharedValue(screenPoints[4].x);
  const point4y = useSharedValue(screenPoints[4].y);

  return [
    { x: point0x, y: point0y, originalX: initialPoints[0].x },
    { x: point1x, y: point1y, originalX: initialPoints[1].x },
    { x: point2x, y: point2y, originalX: initialPoints[2].x },
    { x: point3x, y: point3y, originalX: initialPoints[3].x },
    { x: point4x, y: point4y, originalX: initialPoints[4].x },
  ];
}

export function IntensityChart() {
  const { width } = useWindowDimensions();
  const height = (useWindowDimensions().height * 30) / 100;
  const chartWidth = width - 2 * PADDING;
  const chartHeight = height - 2 * PADDING;

  const [pathString, setPathString] = useState('');
  const [pointRadii, setPointRadii] = useState(DEFAULT_POINTS.map(() => CONTROL_POINT_RADIUS));
  const [timeLabels, setTimeLabels] = useState(() => DEFAULT_POINTS.map((point) => point.x));

  const updateRef = useRef({
    initialRender: true,
    pendingUpdate: false,
  });

  const activePointIndex = useSharedValue(-1);
  const dragStartOffset = useSharedValue({ x: 0, y: 0 });

  const mapToScreen = useCallback(
    (point: ControlPoint) => {
      const x = PADDING + (point.x / DEFAULT_MAX_TIME) * chartWidth;
      const y = PADDING + (1 - point.y) * chartHeight;
      return { x, y };
    },
    [chartWidth, chartHeight, DEFAULT_MAX_TIME]
  );

  const mapFromScreen = useCallback(
    (point: { x: number; y: number }) => {
      const x = ((point.x - PADDING) / chartWidth) * DEFAULT_MAX_TIME;
      const y = 1 - (point.y - PADDING) / chartHeight;
      return { x, y };
    },
    [chartWidth, chartHeight, DEFAULT_MAX_TIME]
  );

  const controlPoints = useAnimatedControlPoints(DEFAULT_POINTS, mapToScreen);

  const createPath = useCallback(() => {
    const screenPoints = controlPoints.map((p) => ({ x: p.x.value, y: p.y.value }));

    screenPoints.sort((a, b) => a.x - b.x);

    let path = `M ${screenPoints[0].x} ${screenPoints[0].y}`;

    for (let i = 0; i < screenPoints.length - 1; i++) {
      const current = screenPoints[i];
      const next = screenPoints[i + 1];

      const controlX1 = current.x + (next.x - current.x) / 3;
      const controlY1 = current.y;
      const controlX2 = next.x - (next.x - current.x) / 3;
      const controlY2 = next.y;

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    path += ` L ${screenPoints[screenPoints.length - 1].x} ${PADDING + chartHeight}`;
    path += ` L ${screenPoints[0].x} ${PADDING + chartHeight}`;
    path += ` Z`;

    return path;
  }, [controlPoints, chartHeight]);

  const updateTimeLabels = useCallback(() => {
    const newTimeLabels = controlPoints.map((point) => {
      const dataPoint = mapFromScreen({ x: point.x.value, y: point.y.value });
      return Math.round(dataPoint.x * 2) / 2;
    });

    newTimeLabels.sort((a, b) => a - b);
    setTimeLabels(newTimeLabels);
  }, [controlPoints, mapFromScreen]);

  const updatePath = useCallback(() => {
    if (updateRef.current.pendingUpdate) return;
    updateRef.current.pendingUpdate = true;

    setPathString(createPath());

    if (activePointIndex.value === -1) {
      updateTimeLabels();
    }

    updateRef.current.pendingUpdate = false;
  }, [createPath, updateTimeLabels, activePointIndex]);

  const updatePointRadius = useCallback((index: number, radius: number) => {
    setPointRadii((prev) => {
      const newRadii = [...prev];
      newRadii[index] = radius;
      return newRadii;
    });
  }, []);

  const updatePointRadiusWorklet = useCallback(
    (index: number, radius: number) => {
      'worklet';
      runOnJS(updatePointRadius)(index, radius);
    },
    [updatePointRadius]
  );

  const updatePathWorklet = useCallback(() => {
    'worklet';
    runOnJS(updatePath)();
  }, [updatePath]);

  const updateTimeLabelsWorklet = useCallback(() => {
    'worklet';
    runOnJS(updateTimeLabels)();
  }, [updateTimeLabels]);

  useEffect(() => {
    if (updateRef.current.initialRender) {
      updateRef.current.initialRender = false;
      updatePath();
    }
  }, [updatePath]);

  const findNeighborConstraints = useCallback(
    (index: number, currentX: number): { minX: number; maxX: number } => {
      'worklet';
      let minX = PADDING;
      let maxX = PADDING + chartWidth;

      let leftNeighborX = Number.MIN_SAFE_INTEGER;
      for (let i = 0; i < controlPoints.length; i++) {
        if (i !== index && controlPoints[i].x.value < currentX) {
          leftNeighborX = Math.max(leftNeighborX, controlPoints[i].x.value);
        }
      }
      if (leftNeighborX > Number.MIN_SAFE_INTEGER) {
        minX = Math.max(minX, leftNeighborX + MIN_POINT_SPACING);
      }

      let rightNeighborX = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < controlPoints.length; i++) {
        if (i !== index && controlPoints[i].x.value > currentX) {
          rightNeighborX = Math.min(rightNeighborX, controlPoints[i].x.value);
        }
      }
      if (rightNeighborX < Number.MAX_SAFE_INTEGER) {
        maxX = Math.min(maxX, rightNeighborX - MIN_POINT_SPACING);
      }

      return { minX, maxX };
    },
    [chartWidth, controlPoints]
  );

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart((e) => {
        'worklet';
        for (let i = 0; i < controlPoints.length; i++) {
          const point = controlPoints[i];
          const distance = Math.sqrt(
            Math.pow(e.x - point.x.value, 2) + Math.pow(e.y - point.y.value, 2)
          );

          if (distance < TOUCH_RADIUS) {
            activePointIndex.value = i;

            dragStartOffset.value = {
              x: point.x.value - e.absoluteX,
              y: point.y.value - e.absoluteY,
            };

            updatePointRadiusWorklet(i, ACTIVE_CONTROL_POINT_RADIUS);
            break;
          }
        }
      })
      .onUpdate((e) => {
        'worklet';
        if (activePointIndex.value !== -1) {
          const index = activePointIndex.value;
          const activePoint = controlPoints[index];

          const newX = e.absoluteX + dragStartOffset.value.x;
          const newY = e.absoluteY + dragStartOffset.value.y;

          const { minX, maxX } = findNeighborConstraints(index, activePoint.x.value);

          const constrainedX = Math.max(minX, Math.min(maxX, newX));
          const constrainedY = Math.max(PADDING, Math.min(PADDING + chartHeight, newY));

          activePoint.x.value = constrainedX;
          activePoint.y.value = constrainedY;

          updatePathWorklet();
        }
      })
      .onEnd(() => {
        'worklet';
        if (activePointIndex.value !== -1) {
          updatePointRadiusWorklet(activePointIndex.value, CONTROL_POINT_RADIUS);
          updateTimeLabelsWorklet();
        }
        activePointIndex.value = -1;
      })
      .onFinalize(() => {
        'worklet';
        if (activePointIndex.value !== -1) {
          updatePointRadiusWorklet(activePointIndex.value, CONTROL_POINT_RADIUS);
          updateTimeLabelsWorklet();
        }
        activePointIndex.value = -1;
      });
  }, [
    controlPoints,
    updatePointRadiusWorklet,
    updatePathWorklet,
    updateTimeLabelsWorklet,
    findNeighborConstraints,
    chartHeight,
  ]);

  const gridLines = useMemo(() => {
    return timeLabels.map((time) => {
      const x = PADDING + (time / DEFAULT_MAX_TIME) * chartWidth;
      return { x, time };
    });
  }, [timeLabels, chartWidth, DEFAULT_MAX_TIME]);

  return (
    <View style={[{ width, height }]}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={{ width, height: '100%' }}>
          <Group>
            {gridLines.map((line, index) => (
              <Line
                key={`grid-${index}`}
                p1={vec(line.x, PADDING)}
                p2={vec(line.x, PADDING + chartHeight)}
                color="rgba(255, 255, 255, 0.1)"
                strokeWidth={0.5}
              />
            ))}
          </Group>

          <Path path={pathString} style="fill">
            <LinearGradient
              start={vec(0, PADDING)}
              end={vec(0, PADDING + chartHeight)}
              colors={DEFAULT_COLORS}
            />
          </Path>

          <Group>
            {controlPoints.map((point, index) => (
              <Circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={pointRadii[index]}
                color="white"
                opacity={0.5}>
                <Circle
                  cx={point.x}
                  cy={point.y}
                  r={pointRadii[index] - 4}
                  color="white"
                  opacity={1}
                />
              </Circle>
            ))}
          </Group>
        </Canvas>
      </GestureDetector>
      <View className="absolute bottom-0 h-10 flex-row">
        {gridLines.map((line, index) => (
          <View
            key={`label-${index}`}
            className="absolute w-8 items-center"
            style={{ left: line.x - 15 }}>
            <Text className="text-sm font-medium text-white">{line.time}</Text>
            <Text className="text-sm text-white opacity-70">min</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
