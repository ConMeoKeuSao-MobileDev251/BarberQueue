/**
 * Address Management Screen
 * List and manage addresses
 */
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { addressesApi } from "@/src/api/addresses";
import { branchesApi } from "@/src/api/branches";
import { colors } from "@/src/constants/theme";
import { showToast } from "@/src/components/ui/toast";
import { ConfirmDialog } from "@/src/components/layout/modal";
import type { Address } from "@/src/types";

interface AddressCardProps {
  address: Address;
  inUse: boolean;
  usedByBranch?: string;
  onDelete: () => void;
}

function AddressCard({ address, inUse, usedByBranch, onDelete }: AddressCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row items-start">
        {/* Icon */}
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${inUse ? "bg-green-100" : "bg-gray-100"}`}
        >
          <Ionicons name="location" size={20} color={inUse ? "#4CAF50" : colors.textTertiary} />
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-text-primary font-montserrat-medium text-sm" numberOfLines={2}>
            {address.addressText}
          </Text>
          <Text className="text-text-tertiary text-xs font-montserrat-regular mt-1">
            {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
          </Text>
          {inUse && usedByBranch && (
            <View className="flex-row items-center mt-2">
              <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
                <Ionicons name="business" size={12} color="#4CAF50" />
                <Text className="text-green-700 text-xs font-montserrat-medium ml-1">
                  {usedByBranch}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Delete */}
        <Pressable
          onPress={onDelete}
          className={`p-2 ${inUse ? "opacity-30" : ""}`}
          disabled={inUse}
        >
          <Ionicons name="trash-outline" size={20} color={inUse ? colors.textTertiary : colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

export default function AddressManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  // Fetch addresses
  const { data: addresses = [], refetch: refetchAddresses, isLoading } = useQuery({
    queryKey: ["owner", "addresses"],
    queryFn: addressesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch branches to check address usage
  const { data: branches = [], refetch: refetchBranches } = useQuery({
    queryKey: ["owner", "branches"],
    queryFn: branchesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Map of addressId -> branch name (for addresses in use)
  const addressUsageMap = useMemo(() => {
    const map = new Map<number, string>();
    branches.forEach((branch) => {
      if (branch.address?.id) {
        map.set(branch.address.id, branch.name);
      }
    });
    return map;
  }, [branches]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (addressId: number) => addressesApi.delete(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "addresses"] });
      setDeleteModalVisible(false);
      setAddressToDelete(null);
      showToast("Đã xóa địa chỉ", "success");
    },
    onError: () => {
      showToast("Không thể xóa địa chỉ", "error");
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchAddresses(), refetchBranches()]);
    setRefreshing(false);
  }, [refetchAddresses, refetchBranches]);

  const handleDelete = (address: Address) => {
    if (addressUsageMap.has(address.id)) {
      showToast("Không thể xóa địa chỉ đang được sử dụng", "error");
      return;
    }
    setAddressToDelete(address);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteMutation.mutate(addressToDelete.id);
    }
  };

  return (
    <View className="flex-1 bg-background-secondary">
      {/* Header */}
      <View className="bg-white px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-montserrat-bold text-text-primary">Địa chỉ</Text>
        <Text className="text-sm font-montserrat-regular text-text-secondary mt-1">
          Quản lý địa chỉ chi nhánh
        </Text>
      </View>

      {/* Address List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-text-secondary font-montserrat-regular">Đang tải...</Text>
          </View>
        ) : addresses.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center">
            <Ionicons name="location-outline" size={48} color={colors.textTertiary} />
            <Text className="text-text-secondary font-montserrat-regular mt-2">
              Chưa có địa chỉ nào
            </Text>
            <Pressable
              onPress={() => router.push("/owner/address/create" as never)}
              className="mt-3 bg-primary px-4 py-2 rounded-full"
            >
              <Text className="text-white font-montserrat-medium">Thêm địa chỉ</Text>
            </Pressable>
          </View>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              inUse={addressUsageMap.has(address.id)}
              usedByBranch={addressUsageMap.get(address.id)}
              onDelete={() => handleDelete(address)}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/owner/address/create" as never)}
        className="absolute right-4 bottom-24 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteModalVisible}
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này?"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setAddressToDelete(null);
        }}
        loading={deleteMutation.isPending}
        destructive
      />
    </View>
  );
}
