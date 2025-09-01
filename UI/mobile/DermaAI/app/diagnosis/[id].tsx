import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import diagnoses from "../../data/dummy-diagnoses.json";
import { Diagnosis } from "../../types/diagnosis";

export default function DiagnosisDetail() {
  const { id } = useLocalSearchParams();
  const item = (diagnoses as Diagnosis[]).find((d) => d.id === id);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "advice">(
    "overview"
  );

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Diagnosis not found</Text>
      </View>
    );
  }

  const handleShare = () => {
    Share.share({
      message: `Diagnosis: ${item.lesionType}\nConfidence: ${
        (item.confidence * 100).toFixed(1) + "%"
      }`,
    });
  };

  return (
    <View style={styles.container}>

      {/* Image placeholder */}
      <View style={styles.imageBox}>
              <Image
        source={
          item.image.startsWith("http")
            ? { uri: item.image }
            : "" //todo rememember to add this `require(`../../assets/images/${item.image}`)`
        }
        style={styles.image}
      />

      </View>

      {/* Prediction */}
      <Text style={styles.predicted}>Predicted: {item.lesionType}</Text>

      {/* Confidence */}
      <View style={styles.confidenceBox}>
        <Text style={styles.confidenceText}>
          Confidence: {(item.confidence).toFixed(0)}%
        </Text>
      </View>

      {/* Date */}
      <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })}
              </Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["overview", "details", "advice"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Markdown>{item.description}</Markdown>
      </ScrollView>

      {/* Footer actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={handleShare}>
          <Feather name="share-2" size={20} color="black" />
          <Text>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather name="file-text" size={20} color="black" />
          <Text>Save as PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Feather name="trash-2" size={20} color="black" />
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 10 },
  imageBox: {
    alignSelf: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    width: 380,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  image: { width: "100%", height: "100%", borderRadius: 12, resizeMode: "cover" },
  predicted: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  confidenceBox: {
    borderWidth: 1,
    borderColor: "#00897B",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  confidenceText: { color: "#00897B", fontWeight: "600" },
  date: { fontSize: 14, color: "#666", marginBottom: 15 },
  tabRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: { paddingVertical: 6, paddingHorizontal: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#00897B" },
  tabText: { fontSize: 16, color: "#666" },
  activeTabText: { color: "#00897B", fontWeight: "600" },
  content: { flex: 1, backgroundColor: "#fdfdfdff", borderRadius: 8, padding: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  action: { alignItems: "center" },
  title: {
    
  }
});
