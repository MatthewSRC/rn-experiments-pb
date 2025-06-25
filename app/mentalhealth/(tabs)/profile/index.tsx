import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CustomBackground } from 'components/mentalhealth/CustomBackground';
import { Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <View className="flex-1">
      <CustomBackground colors={['#f87171', '#fca5a5', '#f87171']} />
      <SafeAreaView className="mb-20 flex-1 justify-around p-4">
        <Text className="text-center text-sm font-light">Version 1.0.1</Text>
        <View className="items-center gap-4">
          <Image
            source={require('assets/images/mentalhealth/alicia.png')}
            className="h-[180px] w-[180px]"
            borderRadius={90}
          />
          <Text className="text-3xl font-medium">Alicia</Text>
        </View>
        <MetricsHeader />
        <View className="items-center gap-4 rounded-3xl bg-white/30 p-6">
          {menu.map((e) => (
            <MenuCard key={e.id} item={e} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function MetricsHeader() {
  return (
    <View className="flex-row justify-around">
      <View className="items-center">
        <Text className="font-light">Lessons</Text>
        <Text className="text-2xl font-medium">34</Text>
      </View>
      <View className="items-center">
        <Text className="font-light">Excercises</Text>
        <Text className="text-2xl font-medium">230 min</Text>
      </View>
      <View className="items-center">
        <Text className="font-light">Day streak</Text>
        <Text className="text-2xl font-medium">3</Text>
      </View>
    </View>
  );
}
function MenuCard({ item }: { item: MenuItemType }) {
  return (
    <View className="w-full flex-row items-center justify-around gap-10">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
        {item.icon}
      </View>
      <View className="flex-1">
        <Text className="text-xl font-medium">{item.title}</Text>
        <Text className="font-light">{item.description}</Text>
      </View>
      <AntDesign name="arrowright" size={24} color="black" />
    </View>
  );
}

const menu = [
  {
    id: 0,
    icon: <FontAwesome name="user" size={32} color="black" />,
    title: 'Profile',
    description: 'Change profile informations',
  },
  {
    id: 1,
    icon: <Ionicons name="settings-sharp" size={32} color="black" />,
    title: 'Settings',
    description: 'Change overall app settings',
  },
  {
    id: 2,
    icon: <FontAwesome5 name="globe" size={32} color="black" />,
    title: 'Website',
    description: 'Navigate through the website',
  },
  {
    id: 3,
    icon: <Ionicons name="document-text" size={32} color="black" />,
    title: 'Terms of service',
    description: 'Read the terms of service',
  },
  {
    id: 4,
    icon: <MaterialIcons name="privacy-tip" size={32} color="black" />,
    title: 'Privacy',
    description: 'Read the privacy notice',
  },
];

type MenuItemType = {
  id: number;
  icon: JSX.Element;
  title: string;
  description: string;
};
