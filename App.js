import { StatusBar } from "expo-status-bar";
import MainNavigator from "./src/navigations/MainNavigator";
import ContextProvider from "contexts";

export default function App() {
  return (
    <ContextProvider>
      <StatusBar style="auto" />
      <MainNavigator />
    </ContextProvider>
  );
}
