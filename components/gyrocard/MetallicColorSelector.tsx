import {
  Canvas,
  Circle,
  LinearGradient,
  vec,
  SweepGradient,
  RadialGradient,
} from '@shopify/react-native-skia';
import { MetallicType } from 'components/gyrocard/metalliccard/types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface MetallicColorSelectorProps {
  selectedType: MetallicType;
  onSelect: (type: MetallicType) => void;
}

const METALLIC_GRADIENTS: Record<
  MetallicType,
  {
    colors: string[];
    type: 'linear' | 'radial' | 'sweep';
  }
> = {
  chrome: {
    colors: ['#c8c8c8', '#a8a8a8', '#888888', '#b0b0b0', '#d0d0d0'],
    type: 'linear',
  },
  obsidian: {
    colors: ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#2a2a2a', '#1a1a1a'],
    type: 'radial',
  },
  gold: {
    colors: ['#d4af8c', '#b8956f', '#9c7b52', '#c0a478', '#e8c9a0'],
    type: 'linear',
  },
  amethyst: {
    colors: ['#b885d1', '#9966b8', '#7a4799', '#8f6bb3', '#c49adc'],
    type: 'radial',
  },
  rose: {
    colors: ['#d1859c', '#b86685', '#9f476e', '#b56b85', '#dc9ab0'],
    type: 'linear',
  },
  ruby: {
    colors: ['#cc7080', '#b85566', '#a4444c', '#bc5f6b', '#d68595'],
    type: 'radial',
  },
  sapphire: {
    colors: ['#708fcc', '#5570b8', '#4455a4', '#6080bc', '#8ca0d6'],
    type: 'linear',
  },
  turquoise: {
    colors: ['#70cccc', '#55b8b8', '#44a4a4', '#60bcbc', '#8cd6d6'],
    type: 'radial',
  },
  emerald: {
    colors: ['#70cc70', '#55b855', '#44a444', '#60bc60', '#8cd68c'],
    type: 'linear',
  },
  holographic: {
    colors: ['#e6669c', '#9966e6', '#6699e6', '#66e699', '#e69966'],
    type: 'sweep',
  },
  pearl: {
    colors: ['#e8e8f0', '#d8d8e6', '#c8c8dc', '#dcdce8', '#f0f0f4'],
    type: 'radial',
  },
};

const COLOR_LAYOUT = (() => {
  const allTypes = Object.keys(METALLIC_GRADIENTS) as MetallicType[];
  return {
    firstRow: allTypes.slice(0, 6),
    secondRow: allTypes.slice(6, 11),
  };
})();

const BUTTON_SIZE = 44;

interface MetallicButtonProps {
  type: MetallicType;
  isSelected: boolean;
  onPress: () => void;
}

function MetallicButton({ type, isSelected, onPress }: MetallicButtonProps) {
  const gradient = METALLIC_GRADIENTS[type];

  const renderGradient = () => {
    const center = vec(BUTTON_SIZE / 2, BUTTON_SIZE / 2);
    const radius = BUTTON_SIZE / 2;

    switch (gradient.type) {
      case 'linear':
        return (
          <LinearGradient
            start={vec(0, 0)}
            end={vec(BUTTON_SIZE, BUTTON_SIZE)}
            colors={gradient.colors}
          />
        );
      case 'radial':
        return <RadialGradient c={center} r={radius} colors={gradient.colors} />;
      case 'sweep':
        return <SweepGradient c={center} colors={gradient.colors} />;
      default:
        return (
          <LinearGradient
            start={vec(0, 0)}
            end={vec(BUTTON_SIZE, BUTTON_SIZE)}
            colors={gradient.colors}
          />
        );
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          overflow: 'hidden',
          borderWidth: isSelected ? 2.5 : 1,
          borderColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)',
          shadowColor: isSelected ? '#FFFFFF' : '#000',
          shadowOffset: { width: 0, height: isSelected ? 0 : 2 },
          shadowOpacity: isSelected ? 0.3 : 0.2,
          shadowRadius: isSelected ? 6 : 3,
          elevation: isSelected ? 6 : 3,
        }}>
        <Canvas style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}>
          <Circle cx={BUTTON_SIZE / 2} cy={BUTTON_SIZE / 2} r={BUTTON_SIZE / 2}>
            {renderGradient()}
          </Circle>
        </Canvas>

        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              transform: [{ translateX: -3 }, { translateY: -3 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export function MetallicColorSelector({ selectedType, onSelect }: MetallicColorSelectorProps) {
  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        {COLOR_LAYOUT.firstRow.map((type) => (
          <MetallicButton
            key={type}
            type={type}
            isSelected={selectedType === type}
            onPress={() => onSelect(type)}
          />
        ))}
      </View>

      <View className="flex-row items-center justify-center">
        <View className="flex-row justify-between" style={{ width: '83%' }}>
          {COLOR_LAYOUT.secondRow.map((type) => (
            <MetallicButton
              key={type}
              type={type}
              isSelected={selectedType === type}
              onPress={() => onSelect(type)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
