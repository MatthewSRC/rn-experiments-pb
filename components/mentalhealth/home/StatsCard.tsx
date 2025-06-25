import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { ReactNode } from 'react';
import { DimensionValue, Text, View } from 'react-native';

function mapValueToHeight(value: number): DimensionValue {
  const h = (value * 100) / 10 + '%';
  return h as DimensionValue;
}

export function LineChart({ color, data, width, height }: LineChartProps) {
  const strokeWidth = 2.5;

  const createOrganicPath = () => {
    const path = Skia.Path.Make();

    if (data.length === 0) return path;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const vPadding = range * 0.15;
    const hPadding = width * 0.06;
    const effectiveWidth = width - hPadding * 2;
    const effectiveXStep = effectiveWidth / (data.length - 1 || 1);
    const yRatio = height / (range + vPadding * 2);

    const pointToCoord = (index: number, value: number) => ({
      x: hPadding + index * effectiveXStep,
      y: height - (value - min + vPadding) * yRatio,
    });

    const firstPoint = pointToCoord(0, data[0]);
    path.moveTo(firstPoint.x, firstPoint.y);
    for (let i = 0; i < data.length - 1; i++) {
      const current = pointToCoord(i, data[i]);
      const next = pointToCoord(i + 1, data[i + 1]);
      const controlPointDistance = effectiveXStep * 0.35;

      const cp1x = current.x + controlPointDistance;
      const cp1y = current.y;
      const cp2x = next.x - controlPointDistance;
      const cp2y = next.y;

      path.cubicTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
    }

    return path;
  };

  return (
    <Canvas style={{ width, height }}>
      <Path
        path={createOrganicPath()}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round"
        strokeJoin="round"
      />
    </Canvas>
  );
}

interface LineChartProps {
  color: string;
  data: number[];
  width: number;
  height: number;
}

export function StressChart({ data }: StressChartProps) {
  return data.map((e) => (
    <View
      key={e.id}
      className={`h-full flex-1 justify-end rounded-full ${e.value >= 8 ? 'bg-red-100' : e.value >= 5 ? 'bg-yellow-100' : 'bg-green-100'}`}>
      <View
        style={{ height: mapValueToHeight(e.value) }}
        className={`w-full rounded-full ${e.value >= 8 ? 'bg-red-300' : e.value >= 5 ? 'bg-yellow-300' : 'bg-green-300'}`}
      />
    </View>
  ));
}

interface StressChartProps {
  data: { id: number; value: number }[];
}

export function StatsCard({ children, title, description }: Props) {
  return (
    <View className="flex-1 justify-around rounded-3xl bg-white/40 p-4">
      <View className="h-20 flex-row gap-2 rounded-xl bg-white p-2">{children}</View>
      <View className="h-4" />
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="font-medium">{description}</Text>
    </View>
  );
}

interface Props {
  children: ReactNode;
  title: string;
  description: string;
}
