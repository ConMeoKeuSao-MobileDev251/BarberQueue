/**
 * Date & Time Selection Screen
 * Choose date and time slot for booking
 */
import { View, Text, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useCartStore } from "@/src/stores";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { TimeSlotGrid, generateTimeSlots } from "@/src/components/shared/time-slot-grid";
import { Button } from "@/src/components/ui/button";

// Generate next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
};

const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function DateTimeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setDateTime, staffName } = useCartStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const dates = useMemo(() => generateDates(), []);

  // Generate time slots (9 AM to 9 PM, 30 min intervals)
  const timeSlots = useMemo(() => {
    // Simulate some unavailable times
    const unavailable = ["12:00", "12:30", "18:00"];
    return generateTimeSlots(9, 21, 30, unavailable);
  }, [selectedDate]);

  const formatSelectedDateTime = () => {
    if (!selectedTime) return null;

    const day = weekdays[selectedDate.getDay()];
    const dateStr = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`;
    return `${day}, ${dateStr} - ${selectedTime}`;
  };

  const handleContinue = () => {
    if (selectedTime) {
      const formatted = formatSelectedDateTime();
      setDateTime(formatted || "");
      router.push("/checkout" as never);
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title={t("checkout.selectDate")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stylist Info */}
        {staffName && (
          <View className="bg-white px-4 py-3 border-b border-border-light">
            <Text className="text-text-secondary text-sm font-montserrat-regular">
              Thợ đã chọn
            </Text>
            <Text className="text-text-primary text-md font-montserrat-semibold">
              {staffName}
            </Text>
          </View>
        )}

        {/* Date Selection */}
        <View className="bg-white p-4 mt-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-4">
            {t("checkout.selectDate")}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {dates.map((date, index) => {
              const isSelected =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth();
              const isToday = index === 0;

              return (
                <View
                  key={index}
                  className={`items-center px-4 py-3 rounded-xl border ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white border-border-medium"
                  }`}
                  style={{ minWidth: 64 }}
                  onTouchEnd={() => {
                    setSelectedDate(date);
                    setSelectedTime(undefined);
                  }}
                >
                  <Text
                    className={`text-xs font-montserrat-medium ${
                      isSelected ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    {isToday ? "Hôm nay" : weekdays[date.getDay()]}
                  </Text>
                  <Text
                    className={`text-lg font-montserrat-bold mt-1 ${
                      isSelected ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {date.getDate()}
                  </Text>
                  <Text
                    className={`text-xs font-montserrat-regular ${
                      isSelected ? "text-white/80" : "text-text-tertiary"
                    }`}
                  >
                    Th{date.getMonth() + 1}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View className="bg-white p-4 mt-4">
          <Text className="text-text-primary text-md font-montserrat-semibold mb-4">
            {t("checkout.selectTime")}
          </Text>

          <TimeSlotGrid
            slots={timeSlots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            columns={4}
          />
        </View>

        {/* Selected Summary */}
        {selectedTime && (
          <View className="bg-primary-light mx-4 mt-4 p-4 rounded-xl">
            <Text className="text-text-primary text-sm font-montserrat-regular">
              Thời gian đã chọn
            </Text>
            <Text className="text-primary text-lg font-montserrat-bold mt-1">
              {formatSelectedDateTime()}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-border-light"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          variant="gradient"
          onPress={handleContinue}
          fullWidth
          disabled={!selectedTime}
        >
          {t("common.continue")}
        </Button>
      </View>
    </View>
  );
}
