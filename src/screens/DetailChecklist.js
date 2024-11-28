import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FAB,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { BASE_URL } from "../data/constant";
import useUser from "contexts/UserContext";

export default function DetailChecklist({ navigation, route: { params } }) {
  const { user } = useUser();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(params.items || []);
  const [toggle, setToggle] = useState(false);
  const [isUpdate, setIsUpdate] = useState({ status: false, itemId: 0 });

  useLayoutEffect(() => {
    navigation.setOptions({ title: params?.name });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/checklist/${params.id}/item`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        ).then((response) => response.json());

        if (response.statusCode === 2000) {
          setItems(response.data);
        } else {
          setItems([]);
          Alert.alert(response.message, response.errorMessage);
        }
      } catch (error) {
        Alert.alert("Gagal Fetch Data", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toggle]);

  const [modalVisible, setModalVisible] = useState(false);
  const [checklistItemName, setChecklistItemName] = useState("");

  async function onSaveChecklist() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/checklist/${params.id}/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ itemName: checklistItemName }),
      }).then((response) => response.json());

      if (response.statusCode === 2000) {
        items.push(response.data);
        setModalVisible(false);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Membuat Item Checklist", error.message);
    } finally {
      setIsUpdate({ status: false, itemId: 0 });
      setChecklistItemName("");
      setLoading(false);
    }
  }

  async function onCheckItem(itemId) {
    try {
      const response = await fetch(
        `${BASE_URL}/checklist/${params.id}/item/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      ).then((response) => response.json());

      if (response.statusCode === 2200) {
        const newItems = items.map((item) => {
          if (item.id === itemId) {
            item.itemCompletionStatus = !item.itemCompletionStatus;
          }

          return item;
        });

        setItems(newItems);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Mengupdate Item Checklist", error.message);
    }
  }

  async function onDeleteChecklistItem(itemId) {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/checklist/${params.id}/item/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      ).then((response) => response.json());

      if (response.statusCode === 2300) {
        const newChecklist = items.filter((item) => item.id != itemId);

        setItems(newChecklist);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Menghapus Item Checklist", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateChecklistItem(itemId) {
    try {
      const response = await fetch(
        `${BASE_URL}/checklist/${params.id}/item/rename/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ itemName: checklistItemName }),
        }
      ).then((response) => response.json());

      console.log(response);

      if (response.statusCode === 2200) {
        const newItems = items.map((item) => {
          if (item.id === itemId) {
            item.name = checklistItemName;
          }

          return item;
        });

        setItems(newItems);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Mengupdate Item Checklist", error.message);
    } finally {
      setIsUpdate({ status: false, itemId: 0 });
      setChecklistItemName("");
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(_, i) => String(i)}
        data={items}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setToggle((prev) => !prev)}
          />
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.checklist,
                {
                  borderColor: colors.outline,
                },
              ]}
              onPress={() =>
                navigation.navigate("DetailItemChecklist", {
                  checklistId: params.id,
                  ...item,
                })
              }
            >
              <View style={styles.checklistDetail}>
                <Text>{item.name}</Text>
                <Checkbox
                  status={item.itemCompletionStatus ? "checked" : "unchecked"}
                  onPress={() => onCheckItem(item.id)}
                />
              </View>
              <View
                style={[
                  styles.checklistDetail,
                  { justifyContent: "flex-start" },
                ]}
              >
                <IconButton
                  icon={"pencil-outline"}
                  size={20}
                  iconColor={colors.secondary}
                  style={{ margin: 0, marginLeft: -12 }}
                  onPress={() => {
                    setIsUpdate({ status: true, itemId: item.id });
                    setChecklistItemName(item.name);
                    setModalVisible(true);
                  }}
                />
                <IconButton
                  icon={"trash-can-outline"}
                  size={20}
                  iconColor={colors.secondary}
                  style={{ margin: 0 }}
                  onPress={() =>
                    Alert.alert(
                      "Konfirmasi Hapus",
                      "Anda yakin ingin menghapus item checklist ini?",
                      [
                        {
                          text: "Batal",
                        },
                        {
                          text: "Hapus",
                          onPress: () => onDeleteChecklistItem(item.id),
                        },
                      ]
                    )
                  }
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setIsUpdate({ status: false, itemId: 0 });
            setChecklistItemName("");
            setModalVisible(false);
          }}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Text variant="labelLarge">{`${
              isUpdate.status ? "Update" : "Buat"
            } Item Checklist`}</Text>
            <TextInput
              mode="outlined"
              label={"Nama Item Checklist"}
              placeholder="Masukkan nama item checklist"
              value={checklistItemName}
              onChangeText={(val) => setChecklistItemName(val)}
              style={{ marginVertical: 16 }}
            />
            <Button
              mode="contained"
              onPress={() => {
                isUpdate.status
                  ? onUpdateChecklistItem(isUpdate.itemId)
                  : onSaveChecklist();
              }}
            >
              Simpan
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  checklist: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  checklistDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 4,
  },
});
