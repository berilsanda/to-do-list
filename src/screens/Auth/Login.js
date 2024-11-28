import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput } from "react-native-paper";
import { BASE_URL } from "../../data/constant";
import useUser from "contexts/UserContext";

export default function Login({ navigation }) {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    setLoading(true);
    try {
      const sendData = {
        username,
        password,
      };
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      }).then((response) => response.json());
      if (response.statusCode === 200 || response.statusCode === 2110) {
        // Temp
        // Should use Secure Storage for better security
        setUser({ token: response.data.token });
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert(response.message, response.errorMessage);
      }
    } catch (error) {
      Alert.alert("Gagal", error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label={"Username"}
          placeholder="Username"
          onChangeText={(val) => setUsername(val)}
          style={{ marginBottom: 16 }}
          disabled={loading}
        />
        <TextInput
          mode="outlined"
          label={"Password"}
          placeholder="Password"
          onChangeText={(val) => setPassword(val)}
          secureTextEntry
          style={{ marginBottom: 16 }}
          disabled={loading}
        />
        <Button
          mode="contained"
          onPress={() => onLogin()}
          disabled={loading}
          loading={loading}
        >
          Masuk
        </Button>
        <Text style={{ textAlign: "center", marginTop: 8 }}>
          Belum punya akun?{" "}
          <Text
            variant="labelMedium"
            suppressHighlighting
            onPress={() => navigation.navigate("Register")}
          >
            Daftar disini
          </Text>
        </Text>
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
});
