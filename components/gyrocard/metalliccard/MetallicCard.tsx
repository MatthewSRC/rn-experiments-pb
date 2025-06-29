import {
  Canvas,
  RoundedRect,
  vec,
  LinearGradient,
  RadialGradient,
  Group,
  SweepGradient,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';
import Animated, { useDerivedValue, useAnimatedStyle } from 'react-native-reanimated';

import { METALLIC_COLORS } from './constants';
import { useMetallicAnimation } from './hooks';
import { MetallicType, MotionIntensity } from './types';

interface MetallicCardProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  metallicType?: MetallicType;
  borderRadius?: number;
  style?: ViewStyle;
  motionIntensity?: MotionIntensity;
}

export function MetallicCard({
  children,
  metallicType = 'chrome',
  width,
  height,
  borderRadius = 24,
  style,
  motionIntensity = 'full',
}: MetallicCardProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cardWidth = width ?? windowWidth * 0.9;
  const cardHeight = height ?? windowHeight * 0.25;

  const animationValues = useMetallicAnimation(
    cardWidth,
    cardHeight,
    motionIntensity,
    metallicType
  );

  const colorPalette = METALLIC_COLORS[metallicType];

  const staticValues = useMemo(
    () => ({
      cardWidth08: cardWidth * 0.8,
      cardWidth09: cardWidth * 0.9,
      cardWidth06: cardWidth * 0.6,
      cardWidth05: cardWidth * 0.5,
      cardWidth04: cardWidth * 0.4,
      cardWidth0375: cardWidth * 0.375,
      cardWidth03: cardWidth * 0.3,
      cardWidth025: cardWidth * 0.25,
      cardWidth0625: cardWidth * 0.625,
      cardWidth04375: cardWidth * 0.4375,
      cardWidth07: cardWidth * 0.7,
      cardWidthHalf: cardWidth / 2,
      cardHeight05: cardHeight * 0.5,
      cardHeight04: cardHeight * 0.4,
      cardHeight035: cardHeight * 0.35,
      cardHeight03: cardHeight * 0.3,
      cardHeight022: cardHeight / 2.2,
      cardHeight02: cardHeight * 0.2,
      cardHeight06: cardHeight * 0.6,
      cardHeight08: cardHeight * 0.8,
      cardHeightFine: cardHeight * 0.05,
      borderRadiusMinus05: borderRadius - 0.5,
      borderRadiusMinus15: borderRadius - 1.5,
    }),
    [cardWidth, cardHeight, borderRadius]
  );

  const containerStyle = useAnimatedStyle(
    () => ({
      transform: [
        { perspective: 800 },
        { rotateY: `${animationValues.rotateY.value}deg` },
        { rotateX: `${animationValues.rotateX.value}deg` },
        { rotateZ: `${animationValues.rotateZ.value}deg` },
      ],
    }),
    [animationValues.rotateY, animationValues.rotateX, animationValues.rotateZ]
  );

  const childrenContainerStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius,
      overflow: 'hidden',
      transform: [
        { perspective: 800 },
        { rotateY: `${animationValues.rotateY.value}deg` },
        { rotateX: `${animationValues.rotateX.value}deg` },
        { rotateZ: `${animationValues.rotateZ.value}deg` },
      ],
    }),
    [animationValues.rotateY, animationValues.rotateX, animationValues.rotateZ, borderRadius]
  );

  const primaryCenter = useDerivedValue(() =>
    vec(animationValues.primaryLightX.value, animationValues.primaryLightY.value)
  );
  const primaryWarmCenter = useDerivedValue(() =>
    vec(animationValues.primaryWarmX.value, animationValues.primaryWarmY.value)
  );
  const primaryCoolCenter = useDerivedValue(() =>
    vec(animationValues.primaryCoolX.value, animationValues.primaryCoolY.value)
  );
  const primaryRadialCenter = useDerivedValue(() =>
    vec(animationValues.primaryRadialX.value, animationValues.primaryRadialY.value)
  );
  const anisotropicCenter = useDerivedValue(() =>
    vec(animationValues.anisotropicX.value, animationValues.anisotropicY.value)
  );
  const anisotropicFineCenter = useDerivedValue(() =>
    vec(animationValues.anisotropicFineDirX.value, animationValues.anisotropicFineDirY.value)
  );
  const anisotropicCoarseCenter = useDerivedValue(() =>
    vec(animationValues.anisotropicCoarseDirX.value, animationValues.anisotropicCoarseDirY.value)
  );
  const specularCenter = useDerivedValue(() =>
    vec(animationValues.specularX.value, animationValues.specularY.value)
  );
  const fresnelCenter = useDerivedValue(() =>
    vec(animationValues.fresnelX.value, animationValues.fresnelY.value)
  );
  const chromaticRedCenter = useDerivedValue(() =>
    vec(animationValues.chromaticRedX.value, animationValues.chromaticRedY.value)
  );
  const chromaticBlueCenter = useDerivedValue(() =>
    vec(animationValues.chromaticBlueX.value, animationValues.chromaticBlueY.value)
  );
  const interferenceCenter = useDerivedValue(() =>
    vec(animationValues.interferenceX.value, animationValues.interferenceY.value)
  );
  const prismCenter = useDerivedValue(() =>
    vec(animationValues.prismX.value, animationValues.prismY.value)
  );

  const rainbowCenter1 = useDerivedValue(() =>
    vec(
      animationValues.rainbowShift1X?.value ?? cardWidth / 2,
      animationValues.rainbowShift1Y?.value ?? cardHeight / 2
    )
  );
  const rainbowCenter2 = useDerivedValue(() =>
    vec(
      animationValues.rainbowShift2X?.value ?? cardWidth / 2,
      animationValues.rainbowShift2Y?.value ?? cardHeight / 2
    )
  );
  const rainbowCenter3 = useDerivedValue(() =>
    vec(
      animationValues.rainbowShift3X?.value ?? cardWidth / 2,
      animationValues.rainbowShift3Y?.value ?? cardHeight / 2
    )
  );

  const staticColors = useMemo(() => {
    const isHolographic = metallicType === 'holographic';
    const isPearl = metallicType === 'pearl';

    return {
      subsurfaceBase: ['#3a3a3a', '#2a2a2a', '#1a1a1a'],
      primaryRadialHighlight: [
        'rgba(255, 255, 255, 1.0)',
        'rgba(250, 255, 255, 0.8)',
        'rgba(240, 245, 255, 0.6)',
        'rgba(220, 235, 250, 0.4)',
        'rgba(200, 220, 240, 0.2)',
        'rgba(0, 0, 0, 0)',
      ],
      anisotropic: [
        'rgba(0, 0, 0, 0)',
        'rgba(80, 90, 110, 0.3)',
        'rgba(140, 155, 180, 0.5)',
        'rgba(200, 215, 240, 0.7)',
        'rgba(240, 250, 255, 0.8)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(250, 255, 255, 0.8)',
        'rgba(220, 235, 250, 0.7)',
        'rgba(180, 195, 220, 0.5)',
        'rgba(120, 135, 160, 0.3)',
        'rgba(0, 0, 0, 0)',
      ],
      chromaticRed: isHolographic
        ? [
            'rgba(255, 20, 147, 0.9)',
            'rgba(255, 100, 180, 0.7)',
            'rgba(255, 180, 220, 0.5)',
            'rgba(0, 0, 0, 0)',
          ]
        : [
            'rgba(255, 120, 120, 0.7)',
            'rgba(255, 160, 160, 0.5)',
            'rgba(255, 200, 200, 0.3)',
            'rgba(0, 0, 0, 0)',
          ],
      chromaticBlue: isHolographic
        ? [
            'rgba(0, 191, 255, 0.9)',
            'rgba(100, 210, 255, 0.7)',
            'rgba(180, 230, 255, 0.5)',
            'rgba(0, 0, 0, 0)',
          ]
        : [
            'rgba(120, 160, 255, 0.7)',
            'rgba(160, 200, 255, 0.5)',
            'rgba(200, 220, 255, 0.3)',
            'rgba(0, 0, 0, 0)',
          ],
      borderColor: isPearl ? 'rgba(200, 210, 230, 0.7)' : 'rgba(255, 255, 255, 0.4)',
      borderColor2: isPearl ? 'rgba(140, 150, 170, 0.9)' : 'rgba(0, 0, 0, 0.6)',
      specularHighlight: [
        'rgba(255, 255, 255, 1.0)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(240, 240, 240, 0.6)',
        'rgba(220, 220, 220, 0.3)',
        'rgba(0, 0, 0, 0)',
      ],
      environmentalReflection: [
        'rgba(60, 70, 90, 0.8)',
        'rgba(80, 90, 110, 0.6)',
        'rgba(120, 130, 150, 0.8)',
        'rgba(80, 90, 110, 0.6)',
        'rgba(60, 70, 90, 0.8)',
      ],
      fresnelEdgeH: [
        'rgba(255, 255, 255, 0.8)',
        'rgba(0, 0, 0, 0)',
        'rgba(0, 0, 0, 0)',
        'rgba(255, 255, 255, 0.8)',
      ],
      fresnelEdgeV: [
        'rgba(255, 255, 255, 0.6)',
        'rgba(0, 0, 0, 0)',
        'rgba(0, 0, 0, 0)',
        'rgba(255, 255, 255, 0.6)',
      ],
    };
  }, [metallicType]);

  const holographicColors = useMemo(
    () =>
      metallicType === 'holographic'
        ? {
            sweep: [
              'rgba(255, 20, 147, 1.0)',
              'rgba(255, 100, 20, 1.0)',
              'rgba(255, 215, 0, 1.0)',
              'rgba(127, 255, 0, 1.0)',
              'rgba(0, 255, 127, 1.0)',
              'rgba(0, 191, 255, 1.0)',
              'rgba(138, 43, 226, 1.0)',
              'rgba(255, 20, 147, 1.0)',
            ],
            rainbow2: [
              'rgba(0, 0, 0, 0)',
              'rgba(255, 69, 180, 0.8)',
              'rgba(255, 140, 0, 0.9)',
              'rgba(173, 255, 47, 1.0)',
              'rgba(0, 255, 255, 1.0)',
              'rgba(75, 0, 255, 0.9)',
              'rgba(255, 20, 147, 0.8)',
              'rgba(0, 0, 0, 0)',
            ],
            rainbow3: [
              'rgba(255, 255, 255, 1.0)',
              'rgba(255, 130, 200, 0.9)',
              'rgba(255, 200, 100, 0.8)',
              'rgba(130, 255, 200, 0.7)',
              'rgba(200, 130, 255, 0.6)',
              'rgba(130, 200, 255, 0.5)',
              'rgba(0, 0, 0, 0)',
            ],
            prism: [
              'rgba(255, 20, 147, 0.9)',
              'rgba(255, 140, 0, 0.9)',
              'rgba(255, 215, 0, 0.9)',
              'rgba(173, 255, 47, 0.9)',
              'rgba(0, 255, 127, 0.9)',
              'rgba(0, 191, 255, 0.9)',
              'rgba(138, 43, 226, 0.9)',
              'rgba(255, 20, 147, 0.9)',
            ],
            interference: [
              'rgba(0, 0, 0, 0)',
              'rgba(255, 69, 180, 0.7)',
              'rgba(173, 255, 47, 0.7)',
              'rgba(75, 180, 255, 0.7)',
              'rgba(255, 180, 75, 0.7)',
              'rgba(180, 75, 255, 0.7)',
              'rgba(255, 140, 200, 0.7)',
              'rgba(0, 0, 0, 0)',
            ],
          }
        : null,
    [metallicType]
  );

  const pearlColors = useMemo(
    () =>
      metallicType === 'pearl'
        ? {
            nacre1: [
              'rgba(255, 250, 240, 0.5)',
              'rgba(255, 255, 250, 0.7)',
              'rgba(250, 255, 255, 0.8)',
              'rgba(255, 250, 255, 0.9)',
              'rgba(255, 255, 255, 1.0)',
              'rgba(250, 255, 255, 0.9)',
              'rgba(255, 255, 250, 0.8)',
              'rgba(255, 250, 255, 0.7)',
              'rgba(245, 245, 250, 0.5)',
            ],
            nacre2: [
              'rgba(250, 245, 255, 0.6)',
              'rgba(255, 252, 255, 0.8)',
              'rgba(255, 255, 252, 0.9)',
              'rgba(252, 255, 255, 1.0)',
              'rgba(255, 252, 255, 1.0)',
              'rgba(255, 255, 252, 1.0)',
              'rgba(252, 255, 255, 0.9)',
              'rgba(255, 255, 255, 0.8)',
              'rgba(245, 250, 255, 0.6)',
            ],
            radial: [
              'rgba(255, 255, 255, 1.0)',
              'rgba(255, 253, 255, 0.9)',
              'rgba(255, 255, 253, 0.8)',
              'rgba(253, 255, 255, 0.7)',
              'rgba(252, 252, 255, 0.5)',
              'rgba(250, 250, 255, 0.3)',
              'rgba(255, 255, 255, 0)',
            ],
            colorDodge: [
              'rgba(255, 240, 230, 0.4)',
              'rgba(255, 250, 240, 0.5)',
              'rgba(250, 255, 250, 0.6)',
              'rgba(240, 250, 255, 0.7)',
              'rgba(250, 240, 255, 0.8)',
              'rgba(255, 240, 250, 0.7)',
              'rgba(255, 250, 240, 0.6)',
              'rgba(250, 255, 250, 0.5)',
              'rgba(240, 240, 255, 0.4)',
            ],
          }
        : null,
    [metallicType]
  );

  return (
    <Animated.View style={[containerStyle, { borderRadius, overflow: 'hidden' }, style]}>
      <Canvas style={{ width: cardWidth, height: cardHeight }}>
        <RoundedRect x={0} y={0} width={cardWidth} height={cardHeight} r={borderRadius}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(cardWidth, cardHeight)}
            colors={colorPalette.base}
          />
        </RoundedRect>

        <Group blendMode="multiply">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={0.7}>
            <RadialGradient
              c={primaryCenter}
              r={staticValues.cardWidth08}
              colors={staticColors.subsurfaceBase}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="screen">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.primaryOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  primaryCenter.value.x - staticValues.cardWidthHalf,
                  primaryCenter.value.y - staticValues.cardHeight022
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  primaryCenter.value.x + staticValues.cardWidthHalf,
                  primaryCenter.value.y + staticValues.cardHeight022
                )
              )}
              colors={colorPalette.primary}
            />
          </RoundedRect>
        </Group>

        <Group blendMode={metallicType === 'holographic' ? 'colorDodge' : 'overlay'}>
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.primaryWarmOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  primaryWarmCenter.value.x - staticValues.cardWidth04,
                  primaryWarmCenter.value.y - staticValues.cardHeight035
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  primaryWarmCenter.value.x + staticValues.cardWidth04,
                  primaryWarmCenter.value.y + staticValues.cardHeight035
                )
              )}
              colors={colorPalette.warm}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="colorDodge">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.primaryCoolOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  primaryCoolCenter.value.x - staticValues.cardWidth0375,
                  primaryCoolCenter.value.y + staticValues.cardHeight04
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  primaryCoolCenter.value.x + staticValues.cardWidth0375,
                  primaryCoolCenter.value.y - staticValues.cardHeight04
                )
              )}
              colors={colorPalette.cool}
            />
          </RoundedRect>
        </Group>

        {metallicType === 'holographic' && holographicColors && (
          <>
            <Group blendMode="screen">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={animationValues.rainbowIntensity1}>
                <SweepGradient c={rainbowCenter1} colors={holographicColors.sweep} />
              </RoundedRect>
            </Group>

            <Group blendMode="overlay">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={animationValues.rainbowIntensity2}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(
                      rainbowCenter2.value.x - staticValues.cardWidth06,
                      rainbowCenter2.value.y - staticValues.cardHeight03
                    )
                  )}
                  end={useDerivedValue(() =>
                    vec(
                      rainbowCenter2.value.x + staticValues.cardWidth06,
                      rainbowCenter2.value.y + staticValues.cardHeight03
                    )
                  )}
                  colors={holographicColors.rainbow2}
                />
              </RoundedRect>
            </Group>

            <Group blendMode="softLight">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={animationValues.rainbowIntensity3}>
                <RadialGradient
                  c={rainbowCenter3}
                  r={staticValues.cardWidth09}
                  colors={holographicColors.rainbow3}
                />
              </RoundedRect>
            </Group>
          </>
        )}

        {metallicType === 'pearl' && pearlColors && (
          <>
            <Group blendMode="overlay">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={0.8}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(
                      primaryCenter.value.x - staticValues.cardWidth03,
                      primaryCenter.value.y - staticValues.cardHeight08
                    )
                  )}
                  end={useDerivedValue(() =>
                    vec(
                      primaryCenter.value.x + staticValues.cardWidth03,
                      primaryCenter.value.y + staticValues.cardHeight08
                    )
                  )}
                  colors={pearlColors.nacre1}
                />
              </RoundedRect>
            </Group>

            <Group blendMode="softLight">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={0.7}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(
                      primaryWarmCenter.value.x - staticValues.cardWidth07,
                      primaryWarmCenter.value.y - staticValues.cardHeight02
                    )
                  )}
                  end={useDerivedValue(() =>
                    vec(
                      primaryWarmCenter.value.x + staticValues.cardWidth07,
                      primaryWarmCenter.value.y + staticValues.cardHeight02
                    )
                  )}
                  colors={pearlColors.nacre2}
                />
              </RoundedRect>
            </Group>

            <Group blendMode="screen">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={0.9}>
                <RadialGradient
                  c={primaryRadialCenter}
                  r={staticValues.cardWidth06}
                  colors={pearlColors.radial}
                />
              </RoundedRect>
            </Group>

            <Group blendMode="colorDodge">
              <RoundedRect
                x={0}
                y={0}
                width={cardWidth}
                height={cardHeight}
                r={borderRadius}
                opacity={0.4}>
                <LinearGradient
                  start={useDerivedValue(() =>
                    vec(
                      primaryCoolCenter.value.x - staticValues.cardWidth05,
                      primaryCoolCenter.value.y - staticValues.cardHeight05
                    )
                  )}
                  end={useDerivedValue(() =>
                    vec(
                      primaryCoolCenter.value.x + staticValues.cardWidth05,
                      primaryCoolCenter.value.y + staticValues.cardHeight05
                    )
                  )}
                  colors={pearlColors.colorDodge}
                />
              </RoundedRect>
            </Group>
          </>
        )}

        <Group blendMode="softLight">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.primaryRadialOpacity}>
            <RadialGradient
              c={primaryRadialCenter}
              r={animationValues.primaryRadialSize}
              colors={staticColors.primaryRadialHighlight}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="screen">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.anisotropicOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  anisotropicCenter.value.x - staticValues.cardWidth04375,
                  anisotropicCenter.value.y + staticValues.cardHeight035
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  anisotropicCenter.value.x + staticValues.cardWidth04375,
                  anisotropicCenter.value.y - staticValues.cardHeight035
                )
              )}
              colors={staticColors.anisotropic}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="softLight">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.anisotropicFineOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  anisotropicFineCenter.value.x - staticValues.cardWidth0625,
                  anisotropicFineCenter.value.y - staticValues.cardHeightFine
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  anisotropicFineCenter.value.x + staticValues.cardWidth0625,
                  anisotropicFineCenter.value.y + staticValues.cardHeightFine
                )
              )}
              colors={[
                'rgba(0, 0, 0, 0)',
                'rgba(160, 170, 190, 0.5)',
                'rgba(220, 230, 250, 0.7)',
                'rgba(255, 255, 255, 0.8)',
                'rgba(220, 230, 250, 0.7)',
                'rgba(160, 170, 190, 0.5)',
                'rgba(0, 0, 0, 0)',
              ]}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="overlay">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.anisotropicCoarseOpacity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  anisotropicCoarseCenter.value.x - staticValues.cardWidth025,
                  anisotropicCoarseCenter.value.y - staticValues.cardHeight06
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  anisotropicCoarseCenter.value.x + staticValues.cardWidth025,
                  anisotropicCoarseCenter.value.y + staticValues.cardHeight06
                )
              )}
              colors={[
                'rgba(0, 0, 0, 0)',
                'rgba(120, 135, 160, 0.4)',
                'rgba(180, 195, 220, 0.6)',
                'rgba(230, 245, 255, 0.8)',
                'rgba(255, 255, 255, 0.9)',
                'rgba(230, 245, 255, 0.8)',
                'rgba(180, 195, 220, 0.6)',
                'rgba(120, 135, 160, 0.4)',
                'rgba(0, 0, 0, 0)',
              ]}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="difference">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.chromaticIntensity}>
            <RadialGradient
              c={chromaticRedCenter}
              r={staticValues.cardWidth08}
              colors={staticColors.chromaticRed}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="difference">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.chromaticIntensity}>
            <RadialGradient
              c={chromaticBlueCenter}
              r={staticValues.cardWidth08}
              colors={staticColors.chromaticBlue}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="hardLight">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.interferenceIntensity}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  interferenceCenter.value.x - staticValues.cardWidth0375,
                  interferenceCenter.value.y - staticValues.cardHeight03
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  interferenceCenter.value.x + staticValues.cardWidth0375,
                  interferenceCenter.value.y + staticValues.cardHeight03
                )
              )}
              colors={
                metallicType === 'holographic' && holographicColors
                  ? holographicColors.interference
                  : [
                      'rgba(0, 0, 0, 0)',
                      'rgba(255, 140, 180, 0.5)',
                      'rgba(140, 255, 180, 0.5)',
                      'rgba(180, 140, 255, 0.5)',
                      'rgba(255, 220, 140, 0.5)',
                      'rgba(140, 220, 255, 0.5)',
                      'rgba(0, 0, 0, 0)',
                    ]
              }
            />
          </RoundedRect>
        </Group>

        <Group blendMode="overlay">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.prismIntensity}>
            <SweepGradient
              c={prismCenter}
              colors={
                metallicType === 'holographic' && holographicColors
                  ? holographicColors.prism
                  : [
                      'rgba(255, 60, 140, 0.6)',
                      'rgba(255, 180, 20, 0.6)',
                      'rgba(220, 255, 20, 0.6)',
                      'rgba(20, 255, 220, 0.6)',
                      'rgba(140, 60, 255, 0.6)',
                      'rgba(255, 60, 180, 0.6)',
                      'rgba(255, 60, 140, 0.6)',
                    ]
              }
            />
          </RoundedRect>
        </Group>

        <Group blendMode="screen">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.specularOpacity}>
            <RadialGradient c={specularCenter} r={60} colors={staticColors.specularHighlight} />
          </RoundedRect>
        </Group>

        <Group blendMode="softLight">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.fresnelIntensity}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(cardWidth, 0)}
              colors={staticColors.fresnelEdgeH}
            />
          </RoundedRect>
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={animationValues.fresnelIntensity}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, cardHeight)}
              colors={staticColors.fresnelEdgeV}
            />
          </RoundedRect>
        </Group>

        <Group blendMode="overlay">
          <RoundedRect
            x={0}
            y={0}
            width={cardWidth}
            height={cardHeight}
            r={borderRadius}
            opacity={0.4}>
            <LinearGradient
              start={useDerivedValue(() =>
                vec(
                  fresnelCenter.value.x - staticValues.cardWidth025,
                  fresnelCenter.value.y - staticValues.cardHeight02
                )
              )}
              end={useDerivedValue(() =>
                vec(
                  fresnelCenter.value.x + staticValues.cardWidth025,
                  fresnelCenter.value.y + staticValues.cardHeight02
                )
              )}
              colors={staticColors.environmentalReflection}
            />
          </RoundedRect>
        </Group>

        <RoundedRect
          x={0.5}
          y={0.5}
          width={cardWidth - 1}
          height={cardHeight - 1}
          r={staticValues.borderRadiusMinus05}
          style="stroke"
          strokeWidth={0.5}
          color={staticColors.borderColor}
        />
        <RoundedRect
          x={1.5}
          y={1.5}
          width={cardWidth - 3}
          height={cardHeight - 3}
          r={staticValues.borderRadiusMinus15}
          style="stroke"
          strokeWidth={0.5}
          color={staticColors.borderColor2}
        />
      </Canvas>

      {children && (
        <Animated.View
          style={[
            childrenContainerStyle,
            {
              paddingTop: 12,
              paddingLeft: 12,
              paddingRight: 12,
              paddingBottom: 12,
            },
          ]}>
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}
