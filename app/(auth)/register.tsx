import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import api from "../../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tncChecked, setTncChecked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateUsername = (text: string) => {
    const usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(text)) {
      setUsernameError(
        "Username should not contain spaces or special or uppercase characters",
      );
    } else {
      setUsernameError("");
    }

    setUsername(text);
  };

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // standard email format

    if (!emailRegex.test(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    setEmail(text);
  };

  const handleRegister = async () => {
    if (usernameError || emailError) {
      alert("Please fix the errors before submitting");
      return;
    }

    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    if (password !== retypePassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!tncChecked) {
      alert("Please agree to Terms and Conditions");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users/register", {
        username,
        email,
        password,
        role: "ADMIN",
      });
      console.log("REGISTER RESPONSE:", response.data);
      router.replace("/login");
    } catch (error: any) {
      console.log("Register error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (retypePassword && text !== retypePassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleRetypePasswordChange = (text: string) => {
    setRetypePassword(text);
    if (password && text !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Register" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={validateUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          style={styles.input}
        />

        <TextInput
          placeholder="Re-type Password"
          value={retypePassword}
          onChangeText={handleRetypePasswordChange}
          style={styles.input}
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <View style={styles.termsContainer}>
          <Checkbox
            status={tncChecked ? "checked" : "unchecked"}
            onPress={() => {
              setTncChecked(!tncChecked);
            }}
          />
          <Text style={styles.termsText}>
            I have read, understood, and agreed to Terms and Conditions
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: tncChecked ? "#00695c" : "#2EB4A4" },
          ]}
          onPress={handleRegister}
          disabled={loading || !tncChecked}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#000000",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 5,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
  },
});
