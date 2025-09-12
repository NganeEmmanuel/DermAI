import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const theme = useColorScheme(); // dark/light support later

  return (
    <Stack>
      {/* Bottom Tab Navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Diagnosis detail page */}
      <Stack.Screen
        name="diagnosis/[id]"
        options={{
          title: "Diagnosis Result",
          headerBackTitle: "Back",
        }}
      />

      {/* Lesion info detail page */}
      <Stack.Screen
        name="lesion/[id]"
        options={{
          title: "Lesion information",
          headerBackTitle: "Back",
        }}
      />

      {/* FAQ detail page */}
      <Stack.Screen
        name="faq/[id]"
        options={{
          title: "FAQ information",
          headerBackTitle: "Back",
        }}
      />

      {/* About detail page */}
      <Stack.Screen
        name="about/[id]"
        options={{
          title: "About information",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
