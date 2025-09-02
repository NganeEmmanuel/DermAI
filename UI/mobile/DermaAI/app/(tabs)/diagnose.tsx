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

export default function DiagnoseScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Capture from camera
  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Confirm → run AI inference (mock for now)
  const confirmDiagnosis = async () => {
    setLoading(true);
    // TODO: send image to AI model here
    setTimeout(() => {
      setLoading(false);
      alert("Inference done! (replace with navigation to results page)");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnose</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.btnText}>📷 Capture Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.btnText}>🖼️ Upload Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Text style={{ color: "#aaa" }}>No image selected</Text>
        )}
      </View>

      {image && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.smallButton, { backgroundColor: "#eee" }]}
            onPress={() => setImage(null)}
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

      {loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#1e9c7c" />
          <Text style={{ marginTop: 8 }}>Analyzing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1e9c7c",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
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
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
