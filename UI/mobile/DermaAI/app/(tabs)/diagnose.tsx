import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { runInference } from "../../lib/inference";
import { saveDiagnosis } from "../../lib/storage";

export default function DiagnoseScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Capture image from camera
  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission needed");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Confirm and run inference
  // const confirmDiagnosis = async () => {
  //   if (!image) return;
  //   setLoading(true);
  //   try {
  //     const inferenceResult = await runInference(image);
  //     setResult(inferenceResult);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Inference failed: " + err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const confirmDiagnosis = async () => {
  if (!image) return;
  setLoading(true);
  try {
    const inferenceResult = await runInference(image);

    // Save to storage
    await saveDiagnosis({
      lesionType: inferenceResult.label,
      confidence: inferenceResult.confidence,
      image,
    });

    setResult(inferenceResult);
  } catch (err) {
    console.error(err);
    alert("Inference failed: " + err);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnose</Text>

      {/* Buttons for capture / upload */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.btnText}>📷 Capture Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.btnText}>🖼️ Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* Preview box */}
      <View style={styles.previewBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Text style={{ color: "#aaa" }}>No image selected</Text>
        )}
      </View>

      {/* Retake + Confirm buttons */}
      {image && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.smallButton, { backgroundColor: "#eee" }]}
            onPress={() => {
              setImage(null);
              setResult(null);
            }}
          >
            <Text style={{ color: "#333" }}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallButton, { backgroundColor: "#1e9c7c" }]}
            onPress={confirmDiagnosis}
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading indicator */}
      {loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#1e9c7c" />
          <Text style={{ marginTop: 8 }}>Analyzing...</Text>
        </View>
      )}

      {/* Result */}
      {result && !loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {result.label}
          </Text>
          <Text style={{ marginTop: 5, color: "#555" }}>
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, color: "#1e9c7c" },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { fontSize: 14, fontWeight: "500" },
  previewBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 12, resizeMode: "cover" },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
