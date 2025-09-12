// app/lesion/[id].tsx
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

// Preload mapping (static requires)
const lesionFiles: Record<string, any> = {
  diagnosis: require("../../assets/markdown/faq/diagnosis.md"),
  treatment: require("../../assets/markdown/faq/treatment.md"),
 what_is_acne: require("../../assets/markdown/faq/what-is-acne.md"),
};

export default function LesionDetail() {
  const { id } = useLocalSearchParams();
  const [content, setContent] = useState("# Loading...");

  useEffect(() => {
    const loadFile = async () => {
      try {
        const file = lesionFiles[id as string];
        if (!file) throw new Error("File not found");

        const asset = Asset.fromModule(file);
        await asset.downloadAsync();
        const fileContent = await FileSystem.readAsStringAsync(asset.localUri!);
        setContent(fileContent);
      } catch (error) {
        console.log("Markdown load error:", error);
        setContent("# Not found\nThe requested page could not be loaded.");
      }
    };
    loadFile();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <Markdown>{content}</Markdown>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
});
