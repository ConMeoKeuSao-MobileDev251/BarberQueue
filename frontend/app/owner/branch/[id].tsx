/**
 * Branch Detail Screen
 * View branch information and staff
 */
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { branchesApi } from "@/src/api/branches";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ScreenHeader } from "@/src/components/layout/screen-header";
import { ConfirmDialog } from "@/src/components/layout/modal";
import type { Branch, User } from "@/src/types";

export default function BranchDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const branchId = parseInt(id || "0");

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Fetch all branches (to get this branch)
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
  });

  // Find the specific branch
  const branch = useMemo(
    () => branches.find((b) => b.id === branchId),
    [branches, branchId]
  );

  // Fetch staff for this branch
  const { data: staff = [] } = useQuery({
    queryKey: ["owner", "branch-staff", branchId],
    queryFn: () => branchesApi.getStaffByBranch(branchId),
    enabled: branchId > 0,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => branchesApi.delete(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "branches"] });
      showToast("Đã xóa chi nhánh", "success");
      router.back();
    },
    onError: () => {
      showToast("Không thể xóa chi nhánh", "error");
    },
  });

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title="Chi tiết chi nhánh" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!branch) {
    return (
      <View className="flex-1 bg-background-secondary">
        <ScreenHeader title="Chi tiết chi nhánh" />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
          <Text className="text-text-secondary font-montserrat-regular mt-2">
            Không tìm thấy chi nhánh
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary">
      <ScreenHeader title="Chi tiết chi nhánh" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
      >
        {/* Branch Header */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center">
              <Ionicons name="business" size={32} color="#2196F3" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-xl font-montserrat-bold text-text-primary">{branch.name}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                <Text className="text-text-secondary text-sm font-montserrat-regular ml-1">
                  {branch.phoneNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-montserrat-semibold text-text-primary mb-3">Địa chỉ</Text>
          <View className="flex-row items-start">
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text className="text-text-primary text-sm font-montserrat-regular ml-2 flex-1">
              {branch.address?.addressText || "Chưa có địa chỉ"}
            </Text>
          </View>
          {branch.address && (
            <Text className="text-text-tertiary text-xs font-montserrat-regular mt-2 ml-7">
              {branch.address.latitude.toFixed(6)}, {branch.address.longitude.toFixed(6)}
            </Text>
          )}
        </View>

        {/* Staff List */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-montserrat-semibold text-text-primary">
              Nhân viên ({staff.length})
            </Text>
            <Pressable onPress={() => router.push("/owner/staff/create" as never)}>
              <Text className="text-sm font-montserrat-medium text-primary">+ Thêm</Text>
            </Pressable>
          </View>

          {staff.length === 0 ? (
            <View className="items-center py-4">
              <Ionicons name="people-outline" size={32} color={colors.textTertiary} />
              <Text className="text-text-tertiary text-sm font-montserrat-regular mt-2">
                Chưa có nhân viên
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {staff.map((s: User) => (
                <Pressable
                  key={s.id}
                  onPress={() => router.push(`/owner/staff/${s.id}` as never)}
                  className="flex-row items-center py-2 border-b border-border-light last:border-b-0"
                >
                  <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center">
                    <Text className="text-primary font-montserrat-bold">
                      {s.fullName?.charAt(0) || "?"}
                    </Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-text-primary font-montserrat-medium">{s.fullName}</Text>
                    <Text className="text-text-secondary text-xs font-montserrat-regular">
                      {s.phoneNumber}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Metadata */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-sm font-montserrat-semibold text-text-primary mb-3">Thông tin</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm font-montserrat-regular">Ngày tạo</Text>
            <Text className="text-text-primary text-sm font-montserrat-medium">
              {new Date(branch.createdAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-secondary text-sm font-montserrat-regular">
              Cập nhật lần cuối
            </Text>
            <Text className="text-text-primary text-sm font-montserrat-medium">
              {new Date(branch.updatedAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <Pressable
          onPress={handleDelete}
          className="flex-row items-center justify-center py-3 mt-4"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text className="text-danger font-montserrat-medium ml-2">Xóa chi nhánh</Text>
        </Pressable>
      </ScrollView>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="Xóa chi nhánh"
        message={`Bạn có chắc chắn muốn xóa chi nhánh "${branch.name}"? Hành động này không thể hoàn tác.`}
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
