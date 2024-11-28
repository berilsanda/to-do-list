import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import DetailChecklist from "../screens/DetailChecklist";
import DetailItemChecklist from "../screens/DetailItemChecklist";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, headerBackTitle: "Kembali" }}
    >
      {/* Auth */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="DetailChecklist"
        component={DetailChecklist}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="DetailItemChecklist"
        component={DetailItemChecklist}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
