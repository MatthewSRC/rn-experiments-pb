import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

export function SearchBox({ text, onChangeText }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShown(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShown(false);

      if (inputRef.current?.isFocused()) {
        inputRef.current.blur();
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function handleIconPress() {
    if (!inputRef.current) {
      return;
    }

    if (!inputRef.current.isFocused()) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }

  return (
    <View className="flex-row items-center rounded-xl bg-white/25">
      <Pressable onPress={handleIconPress} className="ml-4 h-10 w-8 items-center justify-center">
        <AnimatedIcon
          style={{
            transform: [{ scale: keyboardShown ? 0 : 1 }],
            transitionProperty: 'transform',
            transitionDuration: 200,
          }}
          className="absolute"
          name="search1"
          size={24}
          color="white"
        />
        <AnimatedIcon
          style={{
            transform: [{ scale: keyboardShown ? 1 : 0 }],
            transitionProperty: 'transform',
            transitionDuration: 200,
          }}
          name="arrowleft"
          size={24}
          color="white"
        />
      </Pressable>
      <TextInput
        ref={inputRef}
        className="ml-3 h-10 flex-1 font-medium text-white"
        placeholder="Playlist, Artist or Song"
        placeholderTextColor="rgba(255, 255, 255, 0.8)"
        value={text}
        cursorColor="white"
        onChangeText={onChangeText}
      />
    </View>
  );
}

interface Props {
  text: string;
  onChangeText: (newText: string) => void;
}
