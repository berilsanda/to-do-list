import { Alert, StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BASE_URL } from "../data/constant";
import useUser from "contexts/UserContext";
import { Text } from "react-native-paper";

export default function DetailItemChecklist({ navigation, route: { params } }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({ title: params?.name });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/checklist/${params.checklistId}/item/${params.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        ).then((response) => response.json());

        if (response.statusCode != 2110) {
          Alert.alert(response.message, response.errorMessage);
        }
      } catch (error) {
        Alert.alert("Gagal Fetch Data", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="labelLarge">{params.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
