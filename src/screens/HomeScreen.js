import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../data/constant";
import useUser from "contexts/UserContext";
import {
  Button,
  FAB,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused()

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/checklist`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then((response) => response.json());
        if (response.statusCode === 2100) {
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
  }, [toggle, isFocused]);

  const [modalVisible, setModalVisible] = useState(false);
  const [checklistName, setChecklistName] = useState("");

  async function onSaveChecklist() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/checklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: checklistName }),
      }).then((response) => response.json());

      if (response.statusCode === 2000) {
        items.push(response.data);
        setModalVisible(false);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Membuat Checklist", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteChecklist(checklistId) {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/checklist/${checklistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }).then((response) => response.json());

      if (response.statusCode === 2300) {
        const newChecklist = items.filter(
          (checklist) => checklist.id != checklistId
        );

        setItems(newChecklist);
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal Menghapus Checklist", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={{ marginBottom: 16 }}>
          Daftar Checklist
        </Text>
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
                    borderColor: item.checklistCompletionStatus
                      ? colors.primary
                      : colors.outline,
                  },
                ]}
                onPress={() => navigation.navigate("DetailChecklist", item)}
              >
                <Text style={{ flex: 1, marginRight: 16 }}>{item.name}</Text>
                {item.checklistCompletionStatus ? (
                  <IconButton
                    icon={"check"}
                    size={20}
                    iconColor={colors.primary}
                    style={{ margin: 0 }}
                  />
                ) : null}
                <IconButton
                  icon={"trash-can-outline"}
                  size={20}
                  iconColor={colors.secondary}
                  style={{ margin: 0 }}
                  onPress={() =>
                    Alert.alert(
                      "Konfirmasi Hapus",
                      "Anda yakin ingin menghapus checklist ini?",
                      [
                        {
                          text: "Batal",
                        },
                        {
                          text: "Hapus",
                          onPress: () => onDeleteChecklist(item.id),
                        },
                      ]
                    )
                  }
                />
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
              setChecklistName("");
              setModalVisible(false);
            }}
          >
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <Text variant="labelLarge">Buat Checklist</Text>
              <TextInput
                mode="outlined"
                label={"Nama Checklist"}
                placeholder="Masukkan nama checklist"
                value={checklistName}
                onChangeText={(val) => setChecklistName(val)}
                style={{ marginVertical: 16 }}
              />
              <Button mode="contained" onPress={() => onSaveChecklist()}>
                Simpan
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
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
