/**
 * Staff Detail/Edit Screen
 * View and edit staff information
 */
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { usersApi } from "@/src/api/users";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { ConfirmDialog } from "@/src/components/layout/modal";

export default function StaffDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const staffId = parseInt(id || "0");

  // Form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Fetch staff data
  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => usersApi.getById(staffId),
    enabled: staffId > 0,
  });

  // Initialize form with staff data
  useEffect(() => {
    if (staff) {
      setFullName(staff.fullName || "");
      setPhoneNumber(staff.phoneNumber || "");
      setEmail(staff.email || "");
    }
  }, [staff]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { fullName?: string; phoneNumber?: string; email?: string }) =>
      usersApi.update(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      queryClient.invalidateQueries({ queryKey: ["owner", "all-staff"] });
      showToast("Đã cập nhật thông tin", "success");
      setIsEditing(false);
    },
    onError: () => {
      showToast("Không thể cập nhật thông tin", "error");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => usersApi.delete(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "all-staff"] });
      showToast("Đã xóa nhân viên", "success");
      router.back();
    },
    onError: () => {
      showToast("Không thể xóa nhân viên", "error");
    },
  });

  const handleSave = () => {
    if (!fullName.trim()) {
      showToast("Vui lòng nhập họ tên", "error");
      return;
    }

    updateMutation.mutate({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      email: email.trim() || undefined,
    });
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title="Chi tiết nhân viên" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!staff) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title="Chi tiết nhân viên" />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="person-outline" size={48} color={colors.textTertiary} />
          <Text className="text-text-secondary font-montserrat-regular mt-2">
            Không tìm thấy nhân viên
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader
        title="Chi tiết nhân viên"
        rightAction={
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Ionicons
              name={isEditing ? "close" : "create-outline"}
              size={24}
              color={colors.primary}
            />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center">
            <Text className="text-primary text-3xl font-montserrat-bold">
              {staff.fullName?.charAt(0) || "?"}
            </Text>
          </View>
          <View className="mt-2 px-3 py-1 rounded-full bg-green-100">
            <Text className="text-green-700 text-xs font-montserrat-medium">
              {staff.role === "staff" ? "Nhân viên" : staff.role}
            </Text>
          </View>
        </View>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">Họ và tên</Text>
          <TextInput
            className={`bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border ${
              isEditing ? "border-primary" : "border-border-light"
            }`}
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">
            Số điện thoại
          </Text>
          <TextInput
            className={`bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border ${
              isEditing ? "border-primary" : "border-border-light"
            }`}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm font-montserrat-medium text-text-primary mb-2">Email</Text>
          <TextInput
            className={`bg-white rounded-xl px-4 py-3 font-montserrat-regular text-text-primary border ${
              isEditing ? "border-primary" : "border-border-light"
            }`}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Chưa có email"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Metadata */}
        <View className="bg-white rounded-xl p-4 mt-4">
          <Text className="text-sm font-montserrat-semibold text-text-primary mb-3">Thông tin</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm font-montserrat-regular">Ngày tạo</Text>
            <Text className="text-text-primary text-sm font-montserrat-medium">
              {new Date(staff.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-secondary text-sm font-montserrat-regular">
              Cập nhật lần cuối
            </Text>
            <Text className="text-text-primary text-sm font-montserrat-medium">
              {new Date(staff.updatedAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <Pressable
          onPress={handleDelete}
          className="mt-6 flex-row items-center justify-center py-3"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text className="text-danger font-montserrat-medium ml-2">Xóa nhân viên</Text>
        </Pressable>
      </ScrollView>

      {/* Save Button (when editing) */}
      {isEditing && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={handleSave}
            disabled={updateMutation.isPending}
            className={`bg-primary py-4 rounded-xl items-center ${
              updateMutation.isPending ? "opacity-70" : ""
            }`}
          >
            <Text className="text-white font-montserrat-semibold text-base">
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${staff.fullName}"?`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalVisible(false)}
        loading={deleteMutation.isPending}
        destructive
      />
    </View>
  );
}
