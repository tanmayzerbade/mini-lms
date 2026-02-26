import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function CourseWebView() {
  const { title } = useLocalSearchParams();

  const htmlContent = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial; padding: 20px; }
      h1 { color: #2563eb; }
      button {
        background-color: #2563eb;
        color: white;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>Welcome to your enrolled course.</p>
    <p>This content is rendered inside a WebView.</p>
    <button onclick="window.ReactNativeWebView.postMessage('Course Completed')">
      Complete Course
    </button>
  </body>
</html>
`;

  return (
    <>
      <Stack.Screen options={{ title: "Course Content" }} />
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={["*"]}
          source={{
            html: htmlContent,
            headers: {
              "X-Course-Title": title as string,
              "X-Platform": "ReactNative",
            },
          }}
          onMessage={(event) => {
            alert(event.nativeEvent.data);
          }}
        />
      </View>
    </>
  );
}
