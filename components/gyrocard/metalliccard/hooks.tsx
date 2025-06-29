import {
  useSharedValue,
  useDerivedValue,
  useAnimatedSensor,
  SensorType,
  interpolate,
  withSpring,
} from 'react-native-reanimated';

import { MOTION_CONFIGS, SPRING_CONFIGS } from './constants';
import { MotionIntensity, MetallicType } from './types';

export const useMetallicAnimation = (
  cardWidth: number,
  cardHeight: number,
  motionIntensity: MotionIntensity,
  metallicType: MetallicType
) => {
  const gyroscope = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 16,
  });

  const motionConfig = MOTION_CONFIGS[motionIntensity];

  const primaryLightX = useSharedValue(cardWidth / 2);
  const primaryLightY = useSharedValue(cardHeight / 2);
  const primaryWarmX = useSharedValue(cardWidth / 2);
  const primaryWarmY = useSharedValue(cardHeight / 2);
  const primaryCoolX = useSharedValue(cardWidth / 2);
  const primaryCoolY = useSharedValue(cardHeight / 2);
  const primaryRadialX = useSharedValue(cardWidth / 2);
  const primaryRadialY = useSharedValue(cardHeight / 2);
  const anisotropicX = useSharedValue(cardWidth / 2);
  const anisotropicY = useSharedValue(cardHeight / 2);
  const anisotropicFineDirX = useSharedValue(cardWidth / 2);
  const anisotropicFineDirY = useSharedValue(cardHeight / 2);
  const anisotropicCoarseDirX = useSharedValue(cardWidth / 2);
  const anisotropicCoarseDirY = useSharedValue(cardHeight / 2);
  const specularX = useSharedValue(cardWidth / 2);
  const specularY = useSharedValue(cardHeight / 2);
  const fresnelX = useSharedValue(cardWidth / 2);
  const fresnelY = useSharedValue(cardHeight / 2);
  const chromaticRedX = useSharedValue(cardWidth / 2);
  const chromaticRedY = useSharedValue(cardHeight / 2);
  const chromaticBlueX = useSharedValue(cardWidth / 2);
  const chromaticBlueY = useSharedValue(cardHeight / 2);
  const interferenceX = useSharedValue(cardWidth / 2);
  const interferenceY = useSharedValue(cardHeight / 2);
  const prismX = useSharedValue(cardWidth / 2);
  const prismY = useSharedValue(cardHeight / 2);

  const rainbowShift1X = useSharedValue(cardWidth / 2);
  const rainbowShift1Y = useSharedValue(cardHeight / 2);
  const rainbowShift2X = useSharedValue(cardWidth / 2);
  const rainbowShift2Y = useSharedValue(cardHeight / 2);
  const rainbowShift3X = useSharedValue(cardWidth / 2);
  const rainbowShift3Y = useSharedValue(cardHeight / 2);

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const primaryOpacity = useSharedValue(0.8);
  const primaryWarmOpacity = useSharedValue(0.5);
  const primaryCoolOpacity = useSharedValue(0.4);
  const primaryRadialOpacity = useSharedValue(0.6);
  const primaryRadialSize = useSharedValue(120);
  const anisotropicOpacity = useSharedValue(0.4);
  const anisotropicFineOpacity = useSharedValue(0.2);
  const anisotropicCoarseOpacity = useSharedValue(0.3);
  const specularOpacity = useSharedValue(0.4);
  const fresnelIntensity = useSharedValue(0.7);
  const chromaticIntensity = useSharedValue(0.5);
  const interferenceIntensity = useSharedValue(0.4);
  const prismIntensity = useSharedValue(0.6);

  const rainbowIntensity1 = useSharedValue(0.7);
  const rainbowIntensity2 = useSharedValue(0.6);
  const rainbowIntensity3 = useSharedValue(0.5);

  useDerivedValue(() => {
    if (gyroscope.sensor.value) {
      const tiltX = gyroscope.sensor.value.y * motionConfig.gyroSensitivity.x;
      const tiltY = gyroscope.sensor.value.x * motionConfig.gyroSensitivity.y;
      const tiltZ = gyroscope.sensor.value.z * motionConfig.gyroSensitivity.z;

      const lightDirX = Math.sin(tiltX) * cardWidth * motionConfig.lightDirectionScale;
      const lightDirY = Math.sin(tiltY) * cardHeight * motionConfig.lightDirectionScale;

      const primaryX = cardWidth / 2 + lightDirX;
      const primaryY = cardHeight / 2 + lightDirY;
      primaryLightX.value = withSpring(primaryX, SPRING_CONFIGS.METALLIC_REFLECTION);
      primaryLightY.value = withSpring(primaryY, SPRING_CONFIGS.METALLIC_REFLECTION);

      const warmX = cardWidth / 2 + lightDirX * 0.8 + lightDirY * 0.2;
      const warmY = cardHeight / 2 + lightDirY * 0.8 - lightDirX * 0.15;
      primaryWarmX.value = withSpring(warmX, SPRING_CONFIGS.METALLIC_REFLECTION);
      primaryWarmY.value = withSpring(warmY, SPRING_CONFIGS.METALLIC_REFLECTION);

      const coolX = cardWidth / 2 + lightDirX * 1.1 - lightDirY * 0.25;
      const coolY = cardHeight / 2 + lightDirY * 1.1 + lightDirX * 0.2;
      primaryCoolX.value = withSpring(coolX, SPRING_CONFIGS.FRESNEL);
      primaryCoolY.value = withSpring(coolY, SPRING_CONFIGS.FRESNEL);

      const radialX = cardWidth / 2 + lightDirX * 0.9;
      const radialY = cardHeight / 2 + lightDirY * 0.9;
      primaryRadialX.value = withSpring(radialX, SPRING_CONFIGS.DIRECT_REFLECTION);
      primaryRadialY.value = withSpring(radialY, SPRING_CONFIGS.DIRECT_REFLECTION);

      const mainAnisotropicX = cardWidth / 2 + lightDirX * 0.7 - lightDirY * 0.4;
      const mainAnisotropicY = cardHeight / 2 + lightDirY * 0.7 + lightDirX * 0.3;
      anisotropicX.value = withSpring(mainAnisotropicX, SPRING_CONFIGS.METALLIC_REFLECTION);
      anisotropicY.value = withSpring(mainAnisotropicY, SPRING_CONFIGS.METALLIC_REFLECTION);

      const fineAnisotropicX =
        cardWidth / 2 + Math.sin(tiltX * 2) * cardWidth * motionConfig.lightDirectionScale;
      const fineAnisotropicY = cardHeight / 2 + lightDirY * 0.3;
      anisotropicFineDirX.value = withSpring(fineAnisotropicX, SPRING_CONFIGS.DIRECT_REFLECTION);
      anisotropicFineDirY.value = withSpring(fineAnisotropicY, SPRING_CONFIGS.METALLIC_REFLECTION);

      const coarseAnisotropicX = cardWidth / 2 + lightDirX * 0.5;
      const coarseAnisotropicY =
        cardHeight / 2 +
        Math.cos(tiltY * 1.5) * cardHeight * motionConfig.lightDirectionScale * 0.75;
      anisotropicCoarseDirX.value = withSpring(
        coarseAnisotropicX,
        SPRING_CONFIGS.METALLIC_REFLECTION
      );
      anisotropicCoarseDirY.value = withSpring(coarseAnisotropicY, SPRING_CONFIGS.FRESNEL);

      const specX = cardWidth / 2 + lightDirX * 1.3;
      const specY = cardHeight / 2 + lightDirY * 1.3;
      specularX.value = withSpring(specX, SPRING_CONFIGS.DIRECT_REFLECTION);
      specularY.value = withSpring(specY, SPRING_CONFIGS.DIRECT_REFLECTION);

      const fresnelOffsetX =
        Math.cos(tiltX * 2) * cardWidth * motionConfig.lightDirectionScale * 0.5;
      const fresnelOffsetY =
        Math.sin(tiltY * 2) * cardHeight * motionConfig.lightDirectionScale * 0.5;
      fresnelX.value = withSpring(cardWidth / 2 + fresnelOffsetX, SPRING_CONFIGS.FRESNEL);
      fresnelY.value = withSpring(cardHeight / 2 + fresnelOffsetY, SPRING_CONFIGS.FRESNEL);

      const chromaticRedOffsetX =
        Math.sin(tiltX * 2.5) * cardWidth * motionConfig.lightDirectionScale * 0.5;
      const chromaticRedOffsetY =
        Math.cos(tiltY * 2.5) * cardHeight * motionConfig.lightDirectionScale * 0.375;
      chromaticRedX.value = withSpring(
        cardWidth / 2 + chromaticRedOffsetX,
        SPRING_CONFIGS.CHROMATIC
      );
      chromaticRedY.value = withSpring(
        cardHeight / 2 + chromaticRedOffsetY,
        SPRING_CONFIGS.CHROMATIC
      );

      const chromaticBlueOffsetX =
        Math.sin(tiltX * 2.5 + Math.PI) * cardWidth * motionConfig.lightDirectionScale * 0.5;
      const chromaticBlueOffsetY =
        Math.cos(tiltY * 2.5 + Math.PI) * cardHeight * motionConfig.lightDirectionScale * 0.375;
      chromaticBlueX.value = withSpring(
        cardWidth / 2 + chromaticBlueOffsetX,
        SPRING_CONFIGS.CHROMATIC
      );
      chromaticBlueY.value = withSpring(
        cardHeight / 2 + chromaticBlueOffsetY,
        SPRING_CONFIGS.CHROMATIC
      );

      const interferenceOffsetX =
        Math.sin(tiltX * 4 + tiltY * 2) * cardWidth * motionConfig.lightDirectionScale * 0.75;
      const interferenceOffsetY =
        Math.cos(tiltY * 4 + tiltX * 2) * cardHeight * motionConfig.lightDirectionScale * 0.75;
      interferenceX.value = withSpring(cardWidth / 2 + interferenceOffsetX, SPRING_CONFIGS.FRESNEL);
      interferenceY.value = withSpring(
        cardHeight / 2 + interferenceOffsetY,
        SPRING_CONFIGS.FRESNEL
      );

      const prismOffsetX =
        Math.sin(tiltX * 1.5 + tiltY * 0.8) * cardWidth * motionConfig.lightDirectionScale * 0.875;
      const prismOffsetY =
        Math.cos(tiltY * 1.5 + tiltX * 0.8) * cardHeight * motionConfig.lightDirectionScale * 0.875;
      prismX.value = withSpring(cardWidth / 2 + prismOffsetX, SPRING_CONFIGS.CHROMATIC);
      prismY.value = withSpring(cardHeight / 2 + prismOffsetY, SPRING_CONFIGS.CHROMATIC);

      const rainbow1X =
        cardWidth / 2 +
        Math.sin(tiltX * 2.2 + 0) * cardWidth * motionConfig.lightDirectionScale * 0.75;
      const rainbow1Y =
        cardHeight / 2 +
        Math.cos(tiltY * 1.8 + 0) * cardHeight * motionConfig.lightDirectionScale * 0.625;
      rainbowShift1X.value = withSpring(rainbow1X, SPRING_CONFIGS.CHROMATIC);
      rainbowShift1Y.value = withSpring(rainbow1Y, SPRING_CONFIGS.CHROMATIC);

      const rainbow2X =
        cardWidth / 2 +
        Math.sin(tiltX * 1.7 + Math.PI * 0.6) *
          cardWidth *
          motionConfig.lightDirectionScale *
          0.875;
      const rainbow2Y =
        cardHeight / 2 +
        Math.cos(tiltY * 2.3 + Math.PI * 0.4) *
          cardHeight *
          motionConfig.lightDirectionScale *
          0.75;
      rainbowShift2X.value = withSpring(rainbow2X, SPRING_CONFIGS.FRESNEL);
      rainbowShift2Y.value = withSpring(rainbow2Y, SPRING_CONFIGS.FRESNEL);

      const rainbow3X =
        cardWidth / 2 +
        Math.sin(tiltX * 2.8 + Math.PI * 1.2) *
          cardWidth *
          motionConfig.lightDirectionScale *
          0.625;
      const rainbow3Y =
        cardHeight / 2 +
        Math.cos(tiltY * 2.1 + Math.PI * 0.8) *
          cardHeight *
          motionConfig.lightDirectionScale *
          0.875;
      rainbowShift3X.value = withSpring(rainbow3X, SPRING_CONFIGS.METALLIC_REFLECTION);
      rainbowShift3Y.value = withSpring(rainbow3Y, SPRING_CONFIGS.METALLIC_REFLECTION);

      rotateX.value = withSpring(
        -tiltY * motionConfig.rotationMultiplier.x * motionConfig.rotationScale,
        SPRING_CONFIGS.CARD_ROTATION
      );
      rotateY.value = withSpring(
        tiltX * motionConfig.rotationMultiplier.y * motionConfig.rotationScale,
        SPRING_CONFIGS.CARD_ROTATION
      );
      rotateZ.value = withSpring(
        tiltZ * motionConfig.rotationMultiplier.z,
        SPRING_CONFIGS.CARD_ROTATION
      );

      const tiltMagnitude = Math.sqrt(tiltX ** 2 + tiltY ** 2);
      const angleFactor = Math.abs(Math.cos(tiltX) * Math.cos(tiltY));
      const warmFactor = Math.abs(Math.sin(tiltX * 1.5)) * Math.abs(Math.cos(tiltY * 0.8));
      const coolFactor = Math.abs(Math.cos(tiltX * 1.2)) * Math.abs(Math.sin(tiltY * 1.1));

      if (metallicType === 'holographic') {
        primaryOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0, 3], [0.7, 1.0], 'clamp'),
          SPRING_CONFIGS.METALLIC_REFLECTION
        );
        primaryWarmOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.2, 2.5], [0.3, 0.9], 'clamp') * warmFactor,
          SPRING_CONFIGS.METALLIC_REFLECTION
        );
        primaryCoolOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.3, 2.8], [0.25, 0.8], 'clamp') * coolFactor,
          SPRING_CONFIGS.FRESNEL
        );
        rainbowIntensity1.value = withSpring(
          interpolate(tiltMagnitude, [0, 2.5], [0.5, 1.0], 'clamp') * angleFactor,
          SPRING_CONFIGS.CHROMATIC
        );
        rainbowIntensity2.value = withSpring(
          interpolate(tiltMagnitude, [0.3, 2.8], [0.4, 0.9], 'clamp') *
            Math.abs(Math.sin(tiltX + tiltY)),
          SPRING_CONFIGS.FRESNEL
        );
        rainbowIntensity3.value = withSpring(
          interpolate(tiltMagnitude, [0.5, 3], [0.3, 0.8], 'clamp') *
            Math.abs(Math.cos(tiltX - tiltY)),
          SPRING_CONFIGS.METALLIC_REFLECTION
        );
      } else if (metallicType === 'pearl') {
        primaryOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0, 3], [0.5, 0.9], 'clamp'),
          SPRING_CONFIGS.FRESNEL
        );
        primaryWarmOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.2, 2.5], [0.4, 0.8], 'clamp') * warmFactor,
          SPRING_CONFIGS.FRESNEL
        );
        primaryCoolOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.3, 2.8], [0.35, 0.7], 'clamp') * coolFactor,
          SPRING_CONFIGS.FRESNEL
        );
      } else {
        primaryOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0, 3], [0.6, 1.0], 'clamp'),
          SPRING_CONFIGS.METALLIC_REFLECTION
        );
        primaryWarmOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.2, 2.5], [0.2, 0.7], 'clamp') * warmFactor,
          SPRING_CONFIGS.METALLIC_REFLECTION
        );
        primaryCoolOpacity.value = withSpring(
          interpolate(tiltMagnitude, [0.3, 2.8], [0.15, 0.6], 'clamp') * coolFactor,
          SPRING_CONFIGS.FRESNEL
        );
      }

      primaryRadialOpacity.value = withSpring(
        interpolate(tiltMagnitude, [0.5, 2], [0.3, 0.9], 'clamp') * angleFactor,
        SPRING_CONFIGS.DIRECT_REFLECTION
      );
      primaryRadialSize.value = withSpring(
        interpolate(tiltMagnitude, [0, 3], [80, 180], 'clamp'),
        SPRING_CONFIGS.METALLIC_REFLECTION
      );
      anisotropicOpacity.value = withSpring(
        interpolate(tiltMagnitude, [0, 3], [0.2, 0.6], 'clamp') * angleFactor,
        SPRING_CONFIGS.METALLIC_REFLECTION
      );
      anisotropicFineOpacity.value = withSpring(
        interpolate(tiltMagnitude, [0.2, 2], [0.1, 0.4], 'clamp') * Math.abs(Math.cos(tiltX * 2)),
        SPRING_CONFIGS.DIRECT_REFLECTION
      );
      anisotropicCoarseOpacity.value = withSpring(
        interpolate(tiltMagnitude, [0.5, 2.5], [0.15, 0.5], 'clamp') *
          Math.abs(Math.sin(tiltY * 1.5)),
        SPRING_CONFIGS.METALLIC_REFLECTION
      );
      specularOpacity.value = withSpring(
        interpolate(tiltMagnitude, [0.5, 2.5], [0, 0.9], 'clamp') * angleFactor,
        SPRING_CONFIGS.DIRECT_REFLECTION
      );
      fresnelIntensity.value = withSpring(
        interpolate(tiltMagnitude, [0, 2], [0.5, 1.0], 'clamp'),
        SPRING_CONFIGS.FRESNEL
      );
      chromaticIntensity.value = withSpring(
        interpolate(
          tiltMagnitude,
          [0.3, 2],
          [0, metallicType === 'holographic' ? 0.9 : 0.7],
          'clamp'
        ) * angleFactor,
        SPRING_CONFIGS.CHROMATIC
      );
      interferenceIntensity.value = withSpring(
        interpolate(
          tiltMagnitude,
          [0.5, 2.5],
          [0.2, metallicType === 'holographic' ? 0.8 : 0.6],
          'clamp'
        ),
        SPRING_CONFIGS.FRESNEL
      );
      prismIntensity.value = withSpring(
        interpolate(
          tiltMagnitude,
          [1, 3],
          [0, metallicType === 'holographic' ? 1.0 : 0.8],
          'clamp'
        ) * Math.abs(Math.sin(tiltX + tiltY)),
        SPRING_CONFIGS.CHROMATIC
      );
    }
  });

  return {
    primaryLightX,
    primaryLightY,
    primaryWarmX,
    primaryWarmY,
    primaryCoolX,
    primaryCoolY,
    primaryRadialX,
    primaryRadialY,
    anisotropicX,
    anisotropicY,
    anisotropicFineDirX,
    anisotropicFineDirY,
    anisotropicCoarseDirX,
    anisotropicCoarseDirY,
    specularX,
    specularY,
    fresnelX,
    fresnelY,
    chromaticRedX,
    chromaticRedY,
    chromaticBlueX,
    chromaticBlueY,
    interferenceX,
    interferenceY,
    prismX,
    prismY,
    rainbowShift1X,
    rainbowShift1Y,
    rainbowShift2X,
    rainbowShift2Y,
    rainbowShift3X,
    rainbowShift3Y,
    rotateX,
    rotateY,
    rotateZ,
    primaryOpacity,
    primaryWarmOpacity,
    primaryCoolOpacity,
    primaryRadialOpacity,
    primaryRadialSize,
    anisotropicOpacity,
    anisotropicFineOpacity,
    anisotropicCoarseOpacity,
    specularOpacity,
    fresnelIntensity,
    chromaticIntensity,
    interferenceIntensity,
    prismIntensity,
    rainbowIntensity1,
    rainbowIntensity2,
    rainbowIntensity3,
  };
};
