import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { bootstrapAuth } from "shared/store/authSlice";
import { theme } from "./theme";
import Tabs from "./navigation/Tabs";
import AuthScreen from "./screens/AuthScreen";

function Gate() {
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector((state) => state.auth.status === "authenticated");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    void dispatch(bootstrapAuth()).finally(() => setBooted(true));
  }, [dispatch]);

  if (!booted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.color.background }}>
        <ActivityIndicator color={theme.color.primary} />
      </View>
    );
  }
  return isAuthed ? <Tabs /> : <AuthScreen />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Gate />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
