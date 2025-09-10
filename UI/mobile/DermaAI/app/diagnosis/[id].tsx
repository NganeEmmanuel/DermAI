import { Description } from "@/types/description";
import { Feather } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import description from "../../data/dummy-descriptions"; // ✅ still static
import { deleteDiagnosis, getDiagnoses } from "../../lib/storage"; // ✅ new helper functions
import { Diagnosis } from "../../types/diagnosis";

export default function DiagnosisDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [item, setItem] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "advice"
  >("overview");
  const [activeDescription, setActiveDescription] = useState<string | undefined>(
    ""
  );

  // ✅ Load record from AsyncStorage by id
  useEffect(() => {
    const fetchData = async () => {
      const all = await getDiagnoses();
      const found = all.find((d) => d.id === id);
      setItem(found || null);

      if (found) {
        const desc = (description as Description[]).find(
          (i) => i?.lessionType === found.lesionType
        );
        setActiveDescription(desc?.overview);
      }
    };
    fetchData();
  }, [id]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Diagnosis not found</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDiagnosis(item.id); // ✅ remove from AsyncStorage
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not delete record");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    Share.share({
      message: `Diagnosis: ${item.lesionType}\nConfidence: ${(
        item.confidence * 100
      ).toFixed(1)}%`,
    });
  };

  const handleActiveTab = (tab: "overview" | "details" | "advice") => {
    setActiveTab(tab);

    const desc = (description as Description[]).find(
      (i) => i?.lessionType === item.lesionType
    );

    if (tab === "advice") setActiveDescription(desc?.advice);
    else if (tab === "details") setActiveDescription(desc?.details);
    else setActiveDescription(desc?.overview);
  };

  const handleSavePdf = async () => {
    try {
      const fileName = `DermaAI_${item.lesionType}_diagnosis_report.pdf`;

      const html = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h2>⚠️ Disclaimer</h2>
            <p>This report is for informational purposes only and does not replace professional medical advice. Please consult a healthcare provider.</p>
            <hr/>
            <h1>${item.lesionType} Diagnosis Report</h1>
            <p><b>Confidence:</b> ${(item.confidence * 100).toFixed(1)}%</p>
            <p><b>Date:</b> ${new Date(item.date).toLocaleDateString()}</p>
            <h2>Overview</h2>
            <p>${activeDescription}</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Save Diagnosis Report",
        });
      } else {
        Alert.alert("Error", "Sharing not available on this device");
      }
    } catch (err) {
      Alert.alert("Error", "Could not save PDF");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* overlay */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#00897B" />
          <Text style={{ marginTop: 10, color: "white" }}>Deleting...</Text>
        </View>
      )}

      {/* Image */}
      <View style={styles.imageBox}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      {/* Prediction */}
      <Text style={styles.predicted}>Predicted: {item.lesionType}</Text>

      {/* Confidence */}
      <View style={styles.confidenceBox}>
        <Text style={styles.confidenceText}>
          Confidence: {(item.confidence * 100).toFixed(1)}%
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
            onPress={() =>
              handleActiveTab(tab as "overview" | "details" | "advice")
            }
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
        <Markdown>{activeDescription || ""}</Markdown>
      </ScrollView>

      {/* Footer actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={handleShare}>
          <Feather name="share-2" size={20} color="black" />
          <Text>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={handleSavePdf}>
          <Feather name="file-text" size={20} color="black" />
          <Text>Save as PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={handleDelete}>
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  action: { alignItems: "center", marginBottom: 35 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
