import { StyleSheet, Text, View } from "react-native";

export default function DiagnoseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnose</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "600" },
});
