import Entypo from '@expo/vector-icons/Entypo';
import playlists from 'mocks/musicplayer/playlists.json';
import { useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeInRight,
} from 'react-native-reanimated';

function AddPlaylistButton() {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(1, {
      duration: 250,
    });
  }, []);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressValue.value }],
  }));

  return (
    <>
      <View className="h-8" />
      <Animated.View style={rStyle} className="flex-row items-center gap-4 pl-10">
        <View className="h-6 w-6 items-center justify-center rounded-xl bg-white/25">
          <Entypo name="plus" size={18} color="white" />
        </View>
        <Text className="text-white/80">Add Playlist</Text>
      </Animated.View>
      <View className="h-8" />
    </>
  );
}

function PlaylistCard({ item, index, onPress }: PlaylistCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Animated.View
        entering={FadeInRight.delay(index * 100).springify()}
        className="flex-row items-center gap-4 pl-10">
        <Image source={coverImages[item.cover]} className="h-20 w-20 rounded-2xl" />
        <View className="gap-2">
          <Text className="text-xl font-bold text-white">{item.title}</Text>
          <Text className="text-white/80">{item.songs} Songs</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function PlaylistsPage({
  searchFilter,
  onPlayListPress,
}: {
  searchFilter: string;
  onPlayListPress: () => void;
}) {
  return (
    <FlatList
      data={(playlists as Playlist[]).filter((e) =>
        e.title.toLowerCase().includes(searchFilter.toLowerCase())
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={AddPlaylistButton}
      ListFooterComponent={<View className="h-10" />}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={({ item, index }) => (
        <PlaylistCard item={item} index={index} onPress={onPlayListPress} />
      )}
      keyExtractor={(item: Playlist) => `playlist-${item.id}`}
      getItemLayout={(_, index) => ({
        length: 84,
        offset: 84 * index,
        index,
      })}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews
    />
  );
}

interface PlaylistCardProps {
  item: Playlist;
  index: number;
  onPress: () => void;
}

type Playlist = {
  id: number;
  title: string;
  cover: string;
  songs: number;
};

const coverImages: { [key: string]: any } = {
  'galaxy2.jpg': require('assets/images/musicplayer/galaxy2.jpg'),
  'sunset.jpg': require('assets/images/musicplayer/sunset.jpg'),
  'mountain.jpg': require('assets/images/musicplayer/mountain.jpg'),
  'meditation.jpg': require('assets/images/musicplayer/meditation.jpg'),
  'shouting.jpg': require('assets/images/musicplayer/shouting.jpg'),
  'autumn.jpg': require('assets/images/musicplayer/autumn.jpg'),
  'gym.jpg': require('assets/images/musicplayer/gym.jpg'),
};
