// app/(tabs)/info.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function InfoScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Info</Text>

      {/* Common Skin Lesions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Skin Lesions</Text>
        <View style={styles.grid}>
          {[
            { label: "Acne", id: "acne" },
            { label: "Ringworm", id: "ringworm" },
            { label: "Eczema", id: "eczema" },
            { label: "Chickenpox", id: "chickenpox" },
            { label: "Whitlow", id: "whitlow" },
            { label: "Measles", id: "measles" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/lesion/${item.id}`)}
            >
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQ</Text>
        {[
          { label: "What is acne?", id: "what_is_acne" },
          { label: "How is it diagnosed?", id: "diagnosis" },
          { label: "How to treat?", id: "treatment" },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            onPress={() => router.push(`/faq/${item.id}`)}
          >
            <Text style={styles.listText}>{item.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About DermaAI</Text>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("/about/how_it_works")}
        >
          <Text style={styles.listText}>How it works</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#008060",
  },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    flexBasis: "45%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { fontSize: 15, fontWeight: "500" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listText: { fontSize: 15 },
  arrow: { fontSize: 18, color: "#999" },
});
