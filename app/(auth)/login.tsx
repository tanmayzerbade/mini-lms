import { router, Stack } from "expo-router";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { loginUser } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { saveToken } from "../../utils/secureStore";

export default function Login() {
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await loginUser(username, password);
      console.log("LOGIN RESPONSE:", response);

      const token = response.data.accessToken;

      await saveToken(String(token));
      const userData = response.data.user;

      setAuth(String(token), userData);

      router.replace("/courses");
    } catch (error: any) {
      const responseData = error.response?.data;

      let message = "Something went wrong";

      if (responseData?.errors?.length > 0) {
        const firstErrorObj = responseData.errors[0];
        message = Object.values(firstErrorObj)[0] as string;
      } else if (responseData?.message) {
        message = responseData.message;
      }

      console.log("Login error:", message);

      setSnackbarMessage(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Continue your learning journey</Text>
        </View>
        <View style={styles.form}>
          <View style={[styles.inputWrapper]}>
            <User size={20} />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              style={{ marginLeft: "5%", flex: 1 }}
            />
          </View>
          <View style={[styles.inputWrapper]}>
            <Lock size={20} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={secureText}
              style={{ marginLeft: "5%", flex: 1 }}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              {secureText ? <EyeOff size={20} /> : <Eye size={20} />}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.logoutText}>Login</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: "8%", left: "2%" }}>
          <Text>
            Don't have an account?{" "}
            <Text
              onPress={() => router.push("/register")}
              style={{ textDecorationLine: "underline", color: "#2563eb" }}
            >
              Register
            </Text>
          </Text>
        </View>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    marginTop: 30,
    paddingVertical: "3%",
    width: "70%",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#787878",
    alignSelf: "center",
  },

  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
    borderColor: "#000000",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  form: {
    gap: 16,
  },
  header: {
    marginBottom: 40,
  },
  logoSquare: {
    width: 48,
    height: 48,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoDot: {
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
    lineHeight: 22,
  },
});
