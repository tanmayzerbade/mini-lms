import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import {
  Bookmark,
  BookOpen,
  Calendar,
  Camera,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import api from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import { removeToken } from "../../utils/secureStore";

export default function Profile() {
  const { logout } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleLogout = async () => {
    await removeToken();
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/current-user");
        setUser(response.data.data);
      } catch (error: any) {
        console.log("Protected API error:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "Profile",
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {user && (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.avatarContainer}
              >
                <Image
                  source={
                    imageUri
                      ? { uri: imageUri }
                      : require("../../assets/images/face_icon.png")
                  }
                  style={styles.avatar}
                />
                <View style={styles.cameraBadge}>
                  <Camera size={14} color="white" />
                </View>
              </TouchableOpacity>

              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <View style={styles.menuGroup}>
                <ProfileItem
                  icon={<User size={20} color="#64748b" />}
                  label="Login Type"
                  value={user.loginType}
                />
                <ProfileItem
                  icon={<Calendar size={20} color="#64748b" />}
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  isLast
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Activity</Text>
              <View style={styles.menuGroup}>
                <MenuButton
                  icon={<BookOpen size={20} color="#2563eb" />}
                  label="My Courses"
                  onPress={() => router.push("/my-courses")}
                />
                <MenuButton
                  icon={<Bookmark size={20} color="#2563eb" />}
                  label="Bookmarks"
                  onPress={() => router.push("/bookmarks")}
                  isLast
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const ProfileItem = ({ icon, label, value, isLast }: any) => (
  <View style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={styles.menuItemLabel}>{label}</Text>
    </View>
    <Text style={styles.menuItemValue}>{value || "—"}</Text>
  </View>
);

const MenuButton = ({ icon, label, onPress, isLast }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
    onPress={onPress}
  >
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemLabel, { color: "#1e293b" }]}>{label}</Text>
    </View>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#f1f5f9",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748b",
  },
  menuItemValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#AB0000",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1.5,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#000000",
    marginVertical: "3%",
  },
});
