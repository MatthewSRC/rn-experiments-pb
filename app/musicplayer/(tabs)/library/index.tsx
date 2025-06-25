import { MultiTab, TabPage } from 'components/common/MultiTab';
import { Container } from 'components/musicplayer/Container';
import { SearchBox } from 'components/musicplayer/SearchBox';
import { PlaylistsPage } from 'components/musicplayer/library/PlaylistsPage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';

export default function Library() {
  const [searchText, setSearchText] = useState('');

  return (
    <Container>
      <View className="gap-6 p-10 pb-6">
        <Text className="text-3xl font-bold color-white">Library</Text>
        <SearchBox text={searchText} onChangeText={setSearchText} />
      </View>
      <MultiTab paddingH={40} tabTitleStyle={() => ({ paddingBottom: 18 })}>
        <TabPage id={0} title="Playlists">
          <Playlists searchFilter={searchText} />
        </TabPage>
        <TabPage id={1} title="Albums">
          <Playlists searchFilter={searchText} />
        </TabPage>
        <TabPage id={2} title="Podcasts">
          <Playlists searchFilter={searchText} />
        </TabPage>
        <TabPage id={3} title="Favourite Songs">
          <Playlists searchFilter={searchText} />
        </TabPage>
      </MultiTab>
    </Container>
  );
}

function Playlists({ searchFilter }: PlaylistsProps) {
  const router = useRouter();
  function handlePlaylistPress() {
    router.navigate('musicplayer/song');
  }
  return <PlaylistsPage searchFilter={searchFilter} onPlayListPress={handlePlaylistPress} />;
}

interface PlaylistsProps {
  searchFilter: string;
}
