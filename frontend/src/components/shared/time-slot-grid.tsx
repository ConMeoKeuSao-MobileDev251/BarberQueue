/**
 * Time Slot Grid Component
 * Grid of selectable time slots for booking
 */
import { View, Text, Pressable, ScrollView } from "react-native";

interface TimeSlot {
  time: string; // HH:mm format
  available: boolean;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
  columns?: number;
}

export function TimeSlotGrid({
  slots,
  selectedTime,
  onSelectTime,
  columns = 4,
}: TimeSlotGridProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        const isDisabled = !slot.available;

        return (
          <Pressable
            key={slot.time}
            onPress={() => !isDisabled && onSelectTime(slot.time)}
            disabled={isDisabled}
            className={`py-3 rounded-lg items-center justify-center ${
              isSelected
                ? "bg-primary"
                : isDisabled
                ? "bg-gray-100"
                : "bg-white border border-border-medium"
            }`}
            style={{
              width: `${100 / columns - 2}%`,
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <Text
              className={`text-sm font-montserrat-medium ${
                isSelected
                  ? "text-white"
                  : isDisabled
                  ? "text-text-tertiary"
                  : "text-text-primary"
              }`}
            >
              {slot.time}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Time Slot Picker - Horizontal scrollable time picker
 */
interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedTime,
  onSelectTime,
}: TimeSlotPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        const isDisabled = !slot.available;

        return (
          <Pressable
            key={slot.time}
            onPress={() => !isDisabled && onSelectTime(slot.time)}
            disabled={isDisabled}
            className={`px-5 py-3 rounded-full ${
              isSelected
                ? "bg-primary"
                : isDisabled
                ? "bg-gray-100"
                : "bg-white border border-border-medium"
            }`}
            style={{ opacity: isDisabled ? 0.5 : 1 }}
          >
            <Text
              className={`text-sm font-montserrat-medium ${
                isSelected
                  ? "text-white"
                  : isDisabled
                  ? "text-text-tertiary"
                  : "text-text-primary"
              }`}
            >
              {slot.time}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Generate time slots helper
 */
export function generateTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number = 30,
  unavailableTimes: string[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      slots.push({
        time,
        available: !unavailableTimes.includes(time),
      });
    }
  }

  return slots;
}
