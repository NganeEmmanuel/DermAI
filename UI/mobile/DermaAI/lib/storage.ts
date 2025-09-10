// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import { Diagnosis } from "../types/diagnosis";

// Save a new diagnosis
export async function saveDiagnosis(diagnosis: Omit<Diagnosis, "id" | "date">) {
  const newEntry: Diagnosis = {
    id: uuid.v4().toString(),
    lesionType: diagnosis.lesionType,
    confidence: diagnosis.confidence,
    date: new Date().toISOString(),
    image: diagnosis.image,
  };

  try {
    const existing = await AsyncStorage.getItem("diagnoses");
    let data: Diagnosis[] = existing ? JSON.parse(existing) : [];
    data.unshift(newEntry); // newest first
    await AsyncStorage.setItem("diagnoses", JSON.stringify(data));
    return newEntry;
  } catch (err) {
    console.error("Failed to save diagnosis:", err);
    throw err;
  }
}

// Load all saved diagnoses
export async function getDiagnoses(): Promise<Diagnosis[]> {
  try {
    const stored = await AsyncStorage.getItem("diagnoses");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to load diagnoses:", err);
    return [];
  }
}

// Clear all diagnoses (for debugging / reset)
export async function clearDiagnoses() {
  try {
    await AsyncStorage.removeItem("diagnoses");
  } catch (err) {
    console.error("Failed to clear diagnoses:", err);
  }
}

// Delete a diagnosis by id
export async function deleteDiagnosis(id: string) {
  try {
    const stored = await AsyncStorage.getItem("diagnoses");
    if (!stored) return;

    let data: Diagnosis[] = JSON.parse(stored);
    data = data.filter((d) => d.id !== id);

    await AsyncStorage.setItem("diagnoses", JSON.stringify(data));
  } catch (err) {
    console.error("Failed to delete diagnosis:", err);
    throw err;
  }
}

