import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "../theme";
import ClosetScreen from "../screens/ClosetScreen";
import OutfitsScreen from "../screens/OutfitsScreen";
import CreatorScreen from "../screens/CreatorScreen";
import StylistScreen from "../screens/StylistScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Bottom tab bar — the mobile equivalent of the web app's top nav (thumb reach).
export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.color.background },
        headerTitleStyle: { color: theme.color.textStrong, fontWeight: "700" },
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: theme.color.textSoft,
        tabBarStyle: { backgroundColor: theme.color.background, borderTopColor: theme.color.border },
        tabBarLabelStyle: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
        // Simple dot markers keep this dependency-free (no icon lib); swap for
        // @expo/vector-icons when the icon set is chosen.
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>•</Text>,
      }}
    >
      <Tab.Screen name="Closet" component={ClosetScreen} />
      <Tab.Screen name="Outfits" component={OutfitsScreen} />
      <Tab.Screen name="Creator" component={CreatorScreen} />
      <Tab.Screen name="Stylist" component={StylistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
