import {
  BackdropBlur,
  Canvas,
  Fill,
  LinearGradient,
  Path,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useState, useRef } from 'react';
import { useWindowDimensions, StatusBar } from 'react-native';

type ControlPoint = { y: number; xOffset: number; targetXOffset?: number; speed?: number };

const CONFIG = {
  WAVE_UPDATE_INTERVAL: 1,
  COLOR_UPDATE_INTERVAL: 40,
  COLOR_CHANGE_SPEED: 0.005,
  CONTROL_POINTS: 8,
  WAVE_STEP: 1,
  AMPLITUDE: 200,
};

const COLOR_PALETTES = {
  background: [
    ['#9400D3', '#FF4500'],
    ['#FF4500', '#9400D3'],
    ['#9400D3', '#FF4500'],
  ],
  wave: [
    ['#FF1493', '#FDB813'],
    ['#FDB813', '#FF1493'],
    ['#FF1493', '#FDB813'],
  ],
};

export function MusicplayerBackground() {
  const { width } = useWindowDimensions();
  const height = useWindowDimensions().height + (StatusBar.currentHeight ?? 0);
  const waveWidth = width / 1.5;
  const waveHeight = height;

  const [currentPath, setCurrentPath] = useState('');
  const [backgroundColors, setBackgroundColors] = useState(['#6A0DAD', '#4B0082']);
  const [waveColors, setWaveColors] = useState(['#FF69B4', '#DA70D6']);

  const progressRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const controlPointsRef = useRef<ControlPoint[]>([]);
  const lastTimeRef = useRef(0);
  const colorCacheRef = useRef(new Map());

  useEffect(() => {
    controlPointsRef.current = Array(CONFIG.CONTROL_POINTS)
      .fill(0)
      .map((_, i) => {
        if (i === 0 || i === CONFIG.CONTROL_POINTS - 1) {
          return {
            y: i === 0 ? 0 : waveHeight,
            xOffset: 0,
          };
        }

        return {
          y: (i / (CONFIG.CONTROL_POINTS - 1)) * waveHeight,
          xOffset: (Math.random() * 2 - 1) * CONFIG.AMPLITUDE,
          targetXOffset: (Math.random() * 2 - 1) * CONFIG.AMPLITUDE,
          speed: 0.5 + Math.random() * 1.5,
        };
      });
  }, [waveHeight, CONFIG.AMPLITUDE, CONFIG.CONTROL_POINTS]);

  function hex2rgb(hex: string) {
    if (colorCacheRef.current.has(hex)) {
      return colorCacheRef.current.get(hex);
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const result = [r, g, b];

    colorCacheRef.current.set(hex, result);
    return result;
  }

  function rgb2hex(r: number, g: number, b: number) {
    return (
      '#' +
      Math.round(r).toString(16).padStart(2, '0') +
      Math.round(g).toString(16).padStart(2, '0') +
      Math.round(b).toString(16).padStart(2, '0')
    );
  }

  function interpolateColor(color1: string, color2: string, factor: number) {
    const rgb1 = hex2rgb(color1);
    const rgb2 = hex2rgb(color2);

    const r = rgb1[0] + factor * (rgb2[0] - rgb1[0]);
    const g = rgb1[1] + factor * (rgb2[1] - rgb1[1]);
    const b = rgb1[2] + factor * (rgb2[2] - rgb1[2]);

    return rgb2hex(r, g, b);
  }

  function smoothEasing(value: number) {
    return 0.5 - 0.5 * Math.cos(Math.PI * value);
  }

  function generatePath(points: ControlPoint[]) {
    let path = `M ${waveWidth} 0 `;
    const step = CONFIG.WAVE_STEP;

    for (let y = 0; y <= waveHeight; y += step) {
      let segmentIndex = 0;
      while (segmentIndex < points.length - 1 && points[segmentIndex + 1].y < y) {
        segmentIndex++;
      }

      const p0 = points[Math.max(0, segmentIndex - 1)];
      const p1 = points[segmentIndex];
      const p2 = points[Math.min(points.length - 1, segmentIndex + 1)];
      const p3 = points[Math.min(points.length - 1, segmentIndex + 2)];

      const segmentLength = p2.y - p1.y || 1;
      const t = (y - p1.y) / segmentLength;

      const t2 = t * t;
      const t3 = t2 * t;

      const h1 = -0.5 * t3 + t2 - 0.5 * t;
      const h2 = 1.5 * t3 - 2.5 * t2 + 1;
      const h3 = -1.5 * t3 + 2 * t2 + 0.5 * t;
      const h4 = 0.5 * t3 - 0.5 * t2;

      const xOffset = h1 * p0.xOffset + h2 * p1.xOffset + h3 * p2.xOffset + h4 * p3.xOffset;

      const x = waveWidth - xOffset;
      path += `L ${x} ${y} `;
    }

    path += `L 0 ${waveHeight} L 0 0 Z`;
    return path;
  }

  function animateControlPoints(deltaTime: number) {
    const points = controlPointsRef.current;
    let hasChanged = false;

    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i];

      const targetXOffset = point.targetXOffset ?? 0;
      const speed = point.speed ?? 1;

      if (Math.abs(point.xOffset - targetXOffset) < CONFIG.AMPLITUDE * 0.1) {
        point.targetXOffset = (Math.random() * 2 - 1) * CONFIG.AMPLITUDE;
        hasChanged = true;
      }

      const step = ((targetXOffset - point.xOffset) * 0.003 * speed * Math.min(deltaTime, 32)) / 16;

      if (Math.abs(step) > 0.01) {
        point.xOffset += step;
        hasChanged = true;
      }
    }

    return hasChanged;
  }

  function updateColors(progress: number) {
    const { background: backgroundGradients, wave: waveGradients } = COLOR_PALETTES;

    const numBgTransitions = backgroundGradients.length - 1;
    const numWaveTransitions = waveGradients.length - 1;

    const easedProgress = smoothEasing(progress);

    const bgPosition = easedProgress * numBgTransitions;

    const bgIndex = Math.floor(bgPosition);

    const bgFactor = bgPosition - bgIndex;

    const bgNextIndex = (bgIndex + 1) % backgroundGradients.length;

    const bgStartColor = interpolateColor(
      backgroundGradients[bgIndex][0],
      backgroundGradients[bgNextIndex][0],
      bgFactor
    );

    const bgEndColor = interpolateColor(
      backgroundGradients[bgIndex][1],
      backgroundGradients[bgNextIndex][1],
      bgFactor
    );

    const waveOffset = 0.33;
    const wavePosition = ((easedProgress + waveOffset) % 1) * numWaveTransitions;

    const waveIndex = Math.floor(wavePosition);
    const waveFactor = wavePosition - waveIndex;
    const waveNextIndex = (waveIndex + 1) % waveGradients.length;

    const waveStartColor = interpolateColor(
      waveGradients[waveIndex][0],
      waveGradients[waveNextIndex][0],
      waveFactor
    );

    const waveEndColor = interpolateColor(
      waveGradients[waveIndex][1],
      waveGradients[waveNextIndex][1],
      waveFactor
    );

    return {
      background: [bgStartColor, bgEndColor],
      wave: [waveStartColor, waveEndColor],
    };
  }

  useEffect(() => {
    let lastWaveUpdateTime = 0;
    let lastColorUpdateTime = 0;

    function animate(time: number) {
      const deltaTime = lastTimeRef.current ? time - lastTimeRef.current : 16;
      lastTimeRef.current = time;

      const shouldUpdateWave = time - lastWaveUpdateTime >= CONFIG.WAVE_UPDATE_INTERVAL;
      const shouldUpdateColors = time - lastColorUpdateTime >= CONFIG.COLOR_UPDATE_INTERVAL;

      progressRef.current =
        (progressRef.current + (deltaTime * CONFIG.COLOR_CHANGE_SPEED) / 1000) % 1;

      if (shouldUpdateWave) {
        lastWaveUpdateTime = time;
        const pathChanged = animateControlPoints(deltaTime);

        if (pathChanged) {
          const newPath = generatePath(controlPointsRef.current);
          setCurrentPath(newPath);
        }
      }

      if (shouldUpdateColors) {
        lastColorUpdateTime = time;
        const colors = updateColors(progressRef.current);
        setBackgroundColors(colors.background);
        setWaveColors(colors.wave);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    animateControlPoints,
    generatePath,
    updateColors,
    CONFIG.WAVE_UPDATE_INTERVAL,
    CONFIG.COLOR_UPDATE_INTERVAL,
    CONFIG.COLOR_CHANGE_SPEED,
  ]);

  return (
    <Canvas style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(width / 2, 0)}
          end={vec(width / 2, height)}
          colors={backgroundColors}
        />
      </Rect>

      {currentPath ? (
        <Path path={currentPath}>
          <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={waveColors} />
        </Path>
      ) : null}

      <BackdropBlur blur={25}>
        <Fill color="rgba(255, 255, 255, 0.2)" />
      </BackdropBlur>
    </Canvas>
  );
}
