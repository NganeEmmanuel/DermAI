import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Diagnosis } from "../types/diagnosis";

type Props = {
  item: Diagnosis;
};

export default function DiagnosisCard({ item }: Props) {
  return (
    <Link href={`/diagnosis/${item.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.lesion}>{item.lesionType}</Text>
          <Text style={styles.confidence}>
            Confidence: {(item.confidence * 100).toFixed(2)} %
          </Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })}
        </Text>

        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  lesion: { fontSize: 16, fontWeight: "600", color: "#333" },
  confidence: { 
    fontSize: 12, 
    color: "#00897B", 
    borderColor: "#00897B", 
    borderWidth: 1, 
    alignSelf: 'baseline', 
    paddingVertical: 2, 
    paddingHorizontal: 4, 
    borderRadius: 6, 
    marginTop: 7,
},
  date: { fontSize: 12, color: "#666", marginTop: 7 },
  source: { fontSize: 12, marginTop: 5 },
});
