/**
 * Branch Management Screen
 * List and manage branches
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { branchesApi } from "@/src/api/branches";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ConfirmDialog } from "@/src/components/layout/modal";
import type { Branch } from "@/src/types";

interface BranchCardProps {
  branch: Branch;
  staffCount?: number;
  onPress: () => void;
  onDelete: () => void;
}

function BranchCard({ branch, staffCount, onPress, onDelete }: BranchCardProps) {
  return (
    <Pressable onPress={onPress} className="bg-white rounded-xl p-4 mb-3 active:opacity-70">
      <View className="flex-row items-start">
        {/* Icon */}
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
          <Ionicons name="business" size={24} color="#2196F3" />
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-text-primary font-montserrat-semibold text-base">{branch.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text className="text-text-secondary text-sm font-montserrat-regular ml-1">
              {branch.phoneNumber}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text
              className="text-text-secondary text-sm font-montserrat-regular ml-1 flex-1"
              numberOfLines={2}
            >
              {branch.address?.addressText || "Chưa có địa chỉ"}
            </Text>
          </View>
          {staffCount !== undefined && (
            <View className="flex-row items-center mt-2">
              <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
                <Ionicons name="people" size={12} color="#4CAF50" />
                <Text className="text-green-700 text-xs font-montserrat-medium ml-1">
                  {staffCount} nhân viên
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Delete */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function BranchManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  // Fetch branches
  const { data: branches = [], refetch, isLoading } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch staff counts per branch
  const { data: staffCounts = {} } = useQuery({
    queryKey: ["owner", "branch-staff-counts", branches.map((b) => b.id)],
    queryFn: async () => {
      const counts: Record<number, number> = {};
      for (const branch of branches) {
        try {
          const staff = await branchesApi.getStaffByBranch(branch.id);
          counts[branch.id] = staff.length;
        } catch {
          counts[branch.id] = 0;
        }
      }
      return counts;
    },
    enabled: branches.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (branchId: number) => branchesApi.delete(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "branches"] });
      setDeleteModalVisible(false);
      setBranchToDelete(null);
      showToast("Đã xóa chi nhánh", "success");
    },
    onError: () => {
      showToast("Không thể xóa chi nhánh", "error");
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDelete = (branch: Branch) => {
    setBranchToDelete(branch);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (branchToDelete) {
      deleteMutation.mutate(branchToDelete.id);
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View className="bg-white px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-montserrat-bold text-text-primary">Chi nhánh</Text>
        <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
          Quản lý các chi nhánh của bạn
        </Text>
      </View>

      {/* Branch List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
          </View>
        ) : branches.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center">
            <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
            <Text className="text-text-secondary font-montserrat-regular mt-2">
              Chưa có chi nhánh nào
            </Text>
            <Pressable
              onPress={() => router.push("/owner/branch/create" as never)}
              className="mt-3 bg-primary px-4 py-2 rounded-full"
            >
              <Text className="text-white font-montserrat-medium">Thêm chi nhánh</Text>
            </Pressable>
          </View>
        ) : (
          branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              staffCount={staffCounts[branch.id]}
              onPress={() => router.push(`/owner/branch/${branch.id}` as never)}
              onDelete={() => handleDelete(branch)}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/owner/branch/create" as never)}
        className="absolute right-4 bottom-24 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="Xóa chi nhánh"
        message={`Bạn có chắc chắn muốn xóa chi nhánh "${branchToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setBranchToDelete(null);
        }}
        loading={deleteMutation.isPending}
        destructive
      />
    </View>
  );
}
