/**
 * Staff Management Screen
 * List and manage staff members
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { branchesApi } from "@/src/api/branches";
import { usersApi } from "@/src/api/users";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ConfirmDialog } from "@/src/components/layout/modal";
import type { User, Branch } from "@/src/types";

interface StaffCardProps {
  staff: User;
  branchName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

function StaffCard({ staff, branchName, onEdit, onDelete }: StaffCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center">
          <Text className="text-primary text-lg font-montserrat-bold">
            {staff.fullName?.charAt(0) || "?"}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-text-primary font-montserrat-semibold">{staff.fullName}</Text>
          <Text className="text-text-secondary text-xs font-montserrat-regular">
            {staff.phoneNumber}
          </Text>
          {branchName && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="business-outline" size={12} color={colors.textTertiary} />
              <Text className="text-text-tertiary text-xs font-montserrat-regular ml-1">
                {branchName}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row items-center">
          <Pressable onPress={onEdit} className="p-2">
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={onDelete} className="p-2 ml-1">
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function StaffManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<User | null>(null);

  // Fetch branches for filter
  const { data: branches = [], refetch: refetchBranches } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch staff for each branch
  const { data: allStaff = [], refetch: refetchStaff, isLoading } = useQuery({
    queryKey: ["owner", "all-staff", branches.map((b) => b.id)],
    queryFn: async () => {
      const staffByBranch: { staff: User; branchId: number }[] = [];
      for (const branch of branches) {
        try {
          const staff = await branchesApi.getStaffByBranch(branch.id);
          staff.forEach((s) => staffByBranch.push({ staff: s, branchId: branch.id }));
        } catch {
          // Skip if error
        }
      }
      return staffByBranch;
    },
    enabled: branches.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Filter staff by selected branch
  const filteredStaff = useMemo(() => {
    if (!selectedBranchId) return allStaff;
    return allStaff.filter((s) => s.branchId === selectedBranchId);
  }, [allStaff, selectedBranchId]);

  // Branch map for names
  const branchMap = useMemo(
    () => new Map<number, Branch>(branches.map((b) => [b.id, b])),
    [branches]
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (staffId: number) => usersApi.delete(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "all-staff"] });
      setDeleteModalVisible(false);
      setStaffToDelete(null);
      showToast("Đã xóa nhân viên", "success");
    },
    onError: () => {
      showToast("Không thể xóa nhân viên", "error");
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchBranches(), refetchStaff()]);
    setRefreshing(false);
  }, [refetchBranches, refetchStaff]);

  const handleDelete = (staff: User) => {
    setStaffToDelete(staff);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      deleteMutation.mutate(staffToDelete.id);
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View className="bg-white px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-montserrat-bold text-text-primary">Nhân viên</Text>
        <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
          Quản lý đội ngũ nhân viên
        </Text>
      </View>

      {/* Branch Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-border-light max-h-14"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: "center" }}
      >
        <Pressable
          onPress={() => setSelectedBranchId(null)}
          className={`px-4 py-2 rounded-full h-9 justify-center ${!selectedBranchId ? "bg-primary" : "bg-background-secondary"}`}
        >
          <Text
            className={`text-sm font-montserrat-medium ${!selectedBranchId ? "text-white" : "text-text-primary"}`}
          >
            Tất cả
          </Text>
        </Pressable>
        {branches.map((branch) => (
          <Pressable
            key={branch.id}
            onPress={() => setSelectedBranchId(branch.id)}
            className={`px-4 py-2 rounded-full h-9 justify-center ${selectedBranchId === branch.id ? "bg-primary" : "bg-background-secondary"}`}
          >
            <Text
              className={`text-sm font-montserrat-medium ${selectedBranchId === branch.id ? "text-white" : "text-text-primary"}`}
              numberOfLines={1}
            >
              {branch.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Staff List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
          </View>
        ) : filteredStaff.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center">
            <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
            <Text className="text-text-secondary font-montserrat-regular mt-2">
              {selectedBranchId ? "Chi nhánh này chưa có nhân viên" : "Chưa có nhân viên nào"}
            </Text>
            <Pressable
              onPress={() => router.push("/owner/staff/create" as never)}
              className="mt-3 bg-primary px-4 py-2 rounded-full"
            >
              <Text className="text-white font-montserrat-medium">Thêm nhân viên</Text>
            </Pressable>
          </View>
        ) : (
          filteredStaff.map((item) => (
            <StaffCard
              key={item.staff.id}
              staff={item.staff}
              branchName={branchMap.get(item.branchId)?.name}
              onEdit={() => router.push(`/owner/staff/${item.staff.id}` as never)}
              onDelete={() => handleDelete(item.staff)}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/owner/staff/create" as never)}
        className="absolute right-4 bottom-24 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${staffToDelete?.fullName}"?`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setStaffToDelete(null);
        }}
        loading={deleteMutation.isPending}
        destructive
      />
    </View>
  );
}
