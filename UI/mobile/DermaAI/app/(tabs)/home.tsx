import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DiagnosisCard from "../../components/DiagnosisCard";
import { getDiagnoses } from "../../lib/storage"; // ✅ import storage helper
import { Diagnosis } from "../../types/diagnosis";

export default function HomeScreen() {
  const [records, setRecords] = useState<Diagnosis[]>([]);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // ✅ load from AsyncStorage on mount
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const stored = await getDiagnoses();
        if (isActive) setRecords(stored);
      };

      fetchData();

      return () => {
        isActive = false; // cleanup to avoid state updates if screen unmounts
      };
    }, [])
  );

  const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filteredData = records.filter((item) => {
    const matchQuery = item.lesionType
      .toLowerCase()
      .includes(query.toLowerCase());

    const itemDate = normalizeDate(new Date(item.date));
    const matchStart = startDate ? itemDate >= normalizeDate(startDate) : true;
    const matchEnd = endDate ? itemDate <= normalizeDate(endDate) : true;

    return matchQuery && matchStart && matchEnd;
  });

  const resetFilters = () => {
    setQuery("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      {/* 🔎 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by prediction..."
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* 📅 Date Filter + Reset */}
      <View style={styles.filterContainer}>
        <Pressable style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateButtonText}>
            {startDate
              ? startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Start Date"}
          </Text>
        </Pressable>
        <Pressable style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateButtonText}>
            {endDate
              ? endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "End Date"}
          </Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={resetFilters}>
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>

      {/* 📅 Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* 📋 Filtered List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DiagnosisCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            No records found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9ff" },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00897B",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  dateButton: {
    backgroundColor: "#00897B",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "white",
    fontWeight: "600",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
  },
});
