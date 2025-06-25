import { Text, View } from 'react-native';

const PURPLE = '#c084fc';
const RED = '#f87171';
const YELLOW = '#fef08a';
const GREEN = '#86efac';
const CYAN = '#93c5fd';

const weekDays = [
  { id: 0, day: 'M', color: PURPLE, value: 12, textColor: 'white' },
  { id: 1, day: 'T', color: RED, value: 13, textColor: 'white' },
  { id: 2, day: 'W', color: PURPLE, value: 16, textColor: 'white' },
  { id: 3, day: 'T', color: YELLOW, value: 10, textColor: 'black' },
  { id: 4, day: 'F', color: YELLOW, value: 14, textColor: 'black' },
  { id: 5, day: 'S', color: GREEN, value: 15, textColor: 'black' },
  { id: 6, day: 'S', color: CYAN, value: 11, textColor: 'black' },
];

export function MoodCalendar() {
  return (
    <View className="flex-1 justify-around rounded-3xl bg-white/40 p-4">
      <View className="flex-row items-center justify-evenly">
        <Text>Month</Text>
        <View className="rounded-full bg-black px-8 py-3">
          <Text className="text-white">Week</Text>
        </View>
        <Text>Day</Text>
      </View>
      <View className="h-2" />
      <View className="w-full flex-row justify-around">
        {weekDays.map((e) => (
          <View key={e.id} className="items-center gap-3">
            <Text className="text-gray-500">{e.day}</Text>
            <View
              style={{ backgroundColor: e.color }}
              className="h-10 w-10 items-center justify-center rounded-full">
              <Text style={{ color: e.textColor }}>{e.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
