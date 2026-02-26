import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTintColor: "#FFFFFF",
        headerStyle: {
          backgroundColor: "#008978",
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "courses") {
            iconName = focused ? "library" : "library-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#000000",
        tabBarStyle: {
          height: "10%",
          paddingBottom: 6,
          backgroundColor: "#787878",
        },
      })}
    />
  );
}
