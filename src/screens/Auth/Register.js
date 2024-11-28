import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput } from "react-native-paper";
import { BASE_URL } from "../../data/constant";

export default function Register({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onRegister() {
    setLoading(true);
    try {
      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValidation.test(email)) {
        throw new Error("Format email tidak sesuai");
      }

      const sendData = {
        email,
        username,
        password,
      };
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      }).then((response) => response.json())

      if (response.statusCode === 2000) {
        navigation.navigate("Login");
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
          label={"Email"}
          placeholder="Email"
          onChangeText={(val) => setEmail(val)}
          style={{ marginBottom: 16 }}
          disabled={loading}
        />
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
          onPress={() => onRegister()}
          disabled={loading}
          loading={loading}
        >
          Daftar
        </Button>
        <Text style={{ textAlign: "center", marginTop: 8 }}>
          Sudah punya akun?{" "}
          <Text
            variant="labelMedium"
            suppressHighlighting
            onPress={() => navigation.navigate("Login")}
          >
            Masuk disini
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
