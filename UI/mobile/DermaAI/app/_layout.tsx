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
    </Stack>
  );
}
