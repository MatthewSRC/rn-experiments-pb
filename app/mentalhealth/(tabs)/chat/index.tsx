import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomBackground } from 'components/mentalhealth/CustomBackground';
import { FlatList, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const messages = require('mocks/mentalhealth/messages.json') as Message[];

export default function Chat() {
  return (
    <View className="flex-1">
      <CustomBackground colors={['#fde047', '#fef08a', '#fde047']} />
      <SafeAreaView className="mb-20 flex-1 p-4">
        <View className="flex-row justify-between">
          <Text className="text-3xl font-medium">Personal assistant</Text>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>
        <View className="h-4" />
        <View className="flex-row items-center gap-4">
          <Image
            source={require('assets/images/mentalhealth/assistant.png')}
            className="h-14 w-14"
            borderRadius={28}
          />
          <View>
            <Text className="text-xl font-light">Markus</Text>
            <Text className="font-medium">Available now</Text>
          </View>
        </View>
        <View className="h-2" />
        <FlatList
          data={messages.reverse()}
          showsVerticalScrollIndicator={false}
          inverted
          ItemSeparatorComponent={() => <View className="h-6" />}
          ListHeaderComponent={<View className="h-4" />}
          ListFooterComponent={<View className="h-4" />}
          renderItem={({ item }) => <MessageCard item={item} />}
        />
        <View className="h-1" />
        <View className="w-[90%] flex-row items-center justify-between self-center rounded-full bg-white/80 p-4 px-10">
          <Text className="text-lg text-black/50">Write message...</Text>
          <Ionicons name="send-outline" size={24} color="rgba(0, 0, 0, 0.5)" />
        </View>
        <View className="h-4" />
      </SafeAreaView>
    </View>
  );
}

function MessageCard({ item }: { item: Message }) {
  const profilePicture = {
    0: require('assets/images/mentalhealth/assistant.png'),
    1: require('assets/images/mentalhealth/alicia.png'),
  }[item.sender];
  return (
    <View
      className={`max-w-[70%] gap-1 rounded-lg bg-white px-6 py-4 ${item.sender === 0 ? 'ml-8 self-start' : 'mr-8 self-end'}`}>
      <View className="flex-row items-center justify-between">
        {item.sender === 1 && (
          <View className="h-4 w-4 items-center justify-center rounded-full bg-green-400">
            <Entypo name="check" size={12} color="white" />
          </View>
        )}
        <View
          className={`${item.sender === 0 ? 'self-start' : 'self-end'} flex-row items-center gap-4`}>
          {item.sender === 1 && <Text className="font-medium">Alicia</Text>}
          <Image source={profilePicture} className="h-10 w-10" borderRadius={20} />
          {item.sender === 0 && <Text className="font-medium">Markus</Text>}
        </View>
      </View>
      <Text>{item.text}</Text>
    </View>
  );
}

type Message = {
  id: number;
  sender: 0 | 1;
  text: string;
};
