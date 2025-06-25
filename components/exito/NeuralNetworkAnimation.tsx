import {
  Canvas,
  Circle,
  Group,
  Line,
  vec,
  Paint,
  BlurMask,
  interpolateColors,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDerivedValue, withTiming, SharedValue } from 'react-native-reanimated';

import { useScrollKeyframe } from './ScrollKeyframe';

const LAYER_COUNT = 3;
const NODES_PER_LAYER = [4, 7, 4];
const NODE_RADIUS = 8;
const NODE_ACTIVE_COLOR = '#000000';
const NODE_INACTIVE_COLOR = '#CBD5E1';
const CONNECTION_ACTIVE_COLOR = 'rgba(0, 0, 0, 0.5)';
const CONNECTION_INACTIVE_COLOR = 'rgba(203, 213, 225, 0.25)';
const CONNECTION_HIGHLIGHT_COLOR = 'rgba(0, 0, 0, 0.9)';

export const NeuralNetworkAnimation = () => {
  const { width } = useWindowDimensions();
  const { progress } = useScrollKeyframe();

  const nodes = useMemo(() => {
    const result = [];
    const layerWidth = width * 0.8;
    const layerSpacing = layerWidth / (LAYER_COUNT - 1);
    const startX = width * 0.1;

    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      const layerNodes = NODES_PER_LAYER[layer];
      const layerHeight = layerNodes * NODE_RADIUS * 4;
      const startY = (width - layerHeight) / 2 + NODE_RADIUS * 2;

      for (let node = 0; node < layerNodes; node++) {
        result.push({
          x: startX + layer * layerSpacing,
          y: startY + node * NODE_RADIUS * 4,
          layer,
          index: node,
          verticalPosition: node / (layerNodes - 1),
        });
      }
    }

    return result;
  }, [width]);

  const connections = useMemo(() => {
    const result = [];

    for (let i = 0; i < nodes.length; i++) {
      const fromNode = nodes[i];

      if (fromNode.layer < LAYER_COUNT - 1) {
        const nextLayerNodes = nodes.filter((node) => node.layer === fromNode.layer + 1);

        for (let j = 0; j < nextLayerNodes.length; j++) {
          if (
            (fromNode.index + j) % 2 === 0 ||
            fromNode.index === j % NODES_PER_LAYER[fromNode.layer]
          ) {
            const toNode = nextLayerNodes[j];

            const connectionVerticalPosition =
              (fromNode.verticalPosition + toNode.verticalPosition) / 2;

            result.push({
              from: { x: fromNode.x, y: fromNode.y },
              to: { x: toNode.x, y: toNode.y },
              fromIndex: i,
              toIndex: nodes.indexOf(toNode),
              fromLayer: fromNode.layer,
              toLayer: toNode.layer,
              verticalPosition: connectionVerticalPosition,
            });
          }
        }
      }
    }

    return result;
  }, [nodes]);

  const animatedProgress = useDerivedValue(() => {
    return withTiming(Math.min(1, progress * 1.5), { duration: 300 });
  }, [progress]);

  return (
    <Canvas style={{ flex: 1 }}>
      <Group>
        {connections.map((connection, index) => {
          const baseThreshold = 0.15 + connection.fromLayer * 0.3;
          const verticalOffset = connection.verticalPosition * 0.15;
          const animationThreshold = baseThreshold + verticalOffset;

          return (
            <AnimatedConnection
              key={`connection-${index}`}
              from={connection.from}
              to={connection.to}
              animatedProgress={animatedProgress}
              threshold={animationThreshold}
              activeColor={CONNECTION_ACTIVE_COLOR}
              inactiveColor={CONNECTION_INACTIVE_COLOR}
              highlightColor={CONNECTION_HIGHLIGHT_COLOR}
            />
          );
        })}

        {nodes.map((node, index) => {
          const baseThreshold = 0.15 + node.layer * 0.3;
          const verticalOffset = node.verticalPosition * 0.15;
          const animationThreshold = baseThreshold + verticalOffset;

          return (
            <AnimatedNode
              key={`node-${index}`}
              x={node.x}
              y={node.y}
              baseRadius={NODE_RADIUS}
              animatedProgress={animatedProgress}
              threshold={animationThreshold}
              activeColor={NODE_ACTIVE_COLOR}
              inactiveColor={NODE_INACTIVE_COLOR}
            />
          );
        })}
      </Group>
    </Canvas>
  );
};

interface AnimatedNodeProps {
  x: number;
  y: number;
  baseRadius: number;
  animatedProgress: SharedValue<number>;
  threshold: number;
  activeColor: string;
  inactiveColor: string;
}

const AnimatedNode = ({
  x,
  y,
  baseRadius,
  animatedProgress,
  threshold,
  activeColor,
  inactiveColor,
}: AnimatedNodeProps) => {
  const radius = useDerivedValue(() => {
    const progressBeyondThreshold = Math.max(0, animatedProgress.value - threshold);
    const normalizedProgress = Math.min(1, progressBeyondThreshold / 0.2);

    const pulse = Math.sin(animatedProgress.value * 5) * 0.05 + 1;
    const scale = 1 + normalizedProgress * 0.15 * pulse;
    return baseRadius * scale;
  }, [animatedProgress, threshold, baseRadius]);

  const color = useDerivedValue(() => {
    const progressBeyondThreshold = Math.max(0, animatedProgress.value - threshold);
    const normalizedProgress = Math.min(1, progressBeyondThreshold / 0.2);

    return interpolateColors(normalizedProgress, [0, 1], [inactiveColor, activeColor]);
  }, [animatedProgress, threshold, activeColor, inactiveColor]);

  return (
    <Circle cx={x} cy={y} r={radius} color={color}>
      <Paint>
        <BlurMask blur={2} style="solid" />
      </Paint>
    </Circle>
  );
};

interface AnimatedConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  animatedProgress: SharedValue<number>;
  threshold: number;
  activeColor: string;
  inactiveColor: string;
  highlightColor: string;
}

const AnimatedConnection = ({
  from,
  to,
  animatedProgress,
  threshold,
  activeColor,
  inactiveColor,
  highlightColor,
}: AnimatedConnectionProps) => {
  const dataPosition = useDerivedValue(() => {
    const progressBeyondThreshold = Math.max(0, animatedProgress.value - threshold);
    const normalizedProgress = Math.min(1, progressBeyondThreshold / 0.2);

    if (normalizedProgress < 0.2) return -1;

    const position = (normalizedProgress - 0.2) / 0.8;
    return position;
  }, [animatedProgress, threshold]);

  const strokeWidth = useDerivedValue(() => {
    const progressBeyondThreshold = Math.max(0, animatedProgress.value - threshold);
    const normalizedProgress = Math.min(1, progressBeyondThreshold / 0.2);

    return 0.8 + normalizedProgress * 1.4;
  }, [animatedProgress, threshold]);

  const color = useDerivedValue(() => {
    const progressBeyondThreshold = Math.max(0, animatedProgress.value - threshold);
    const normalizedProgress = Math.min(1, progressBeyondThreshold / 0.2);

    return interpolateColors(normalizedProgress, [0, 1], [inactiveColor, activeColor]);
  }, [animatedProgress, threshold, activeColor, inactiveColor]);

  const dataX = useDerivedValue(() => {
    if (dataPosition.value < 0) return -100;
    return from.x + (to.x - from.x) * dataPosition.value;
  }, [dataPosition, from.x, to.x]);

  const dataY = useDerivedValue(() => {
    if (dataPosition.value < 0) return -100;
    return from.y + (to.y - from.y) * dataPosition.value;
  }, [dataPosition, from.y, to.y]);

  return (
    <>
      <Line p1={vec(from.x, from.y)} p2={vec(to.x, to.y)} strokeWidth={strokeWidth} color={color} />
      <Circle cx={dataX} cy={dataY} r={3} color={highlightColor}>
        <Paint>
          <BlurMask blur={4} style="normal" />
        </Paint>
      </Circle>
    </>
  );
};
