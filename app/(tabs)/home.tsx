import { Stack, router } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />

      <View style={styles.container}>
        <View style={styles.content}>
          <BookOpen size={60} color="#2563eb" />

          <Text style={styles.title}>
            Welcome {user?.username || "Learner"} 👋
          </Text>

          <Text style={styles.subtitle}>
            Ready to continue your learning journey?
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/courses")}
          >
            <Text style={styles.buttonText}>Explore Courses</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  content: {
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#787878",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    elevation: 4,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
