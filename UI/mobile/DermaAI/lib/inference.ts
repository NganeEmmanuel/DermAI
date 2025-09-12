// lib/inference.ts
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImageManipulator from 'expo-image-manipulator';

// Constants
const IMAGE_SIZE = 224;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const CLASS_NAMES = [
  'Acne', 'Actinic_Keratosis', 'Athlete_foot', 'Autoimmune_Disease',
  'Basal_cell_carcinoma', 'Benign_Tumor', 'Chickenpox', 'Cowpox', 'Eczema',
  'Healthy', 'Herpes', 'Impetigo', 'Larva_Migrans', 'Leprosy', 'Measles',
  'Melanoma', 'Moles', 'Monkeypox', 'Nail_Fungus', 'Neurofibromatosis', 'Nevus',
  'Psoriasis', 'Rash_Dermatitis', 'Ringworm', 'Scabies', 'Seborrheic_Keratosis',
  'Shingles', 'Squamous_Cell_Carcinoma', 'Tungiasis', 'Vascular_Lesion',
  'Warts', 'vitiligo', 'whitlow'
];

let model: tf.GraphModel | null = null;

/**
 * Load the TensorFlow.js model from assets
 */
export async function loadModel(): Promise<tf.GraphModel> {
  if (!model) {
    await tf.ready();
    model = await tf.loadGraphModel(
      bundleResourceIO(
        require('../assets/tfjs_model/model.json'),
        [
            require('../assets/tfjs_model/group1-shard1of11.bin'),
            require('../assets/tfjs_model/group1-shard2of11.bin'),
            require('../assets/tfjs_model/group1-shard3of11.bin'),
            require('../assets/tfjs_model/group1-shard4of11.bin'),
            require('../assets/tfjs_model/group1-shard5of11.bin'),
            require('../assets/tfjs_model/group1-shard6of11.bin'),
            require('../assets/tfjs_model/group1-shard7of11.bin'),
            require('../assets/tfjs_model/group1-shard8of11.bin'),
            require('../assets/tfjs_model/group1-shard9of11.bin'),
            require('../assets/tfjs_model/group1-shard10of11.bin'),
            require('../assets/tfjs_model/group1-shard11of11.bin'),
        ] // ✅ Confirm actual shard name
        
      )
    );
    console.log('TFJS model loaded');
  }
  return model;
}

/**
 * Run inference on a given image URI
 */
export async function runInference(
  imageUri: string
): Promise<{ label: string; confidence: number }> {
  const model = await loadModel();

  // Resize image using Expo ImageManipulator
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
    { format: ImageManipulator.SaveFormat.JPEG }
  );

  // Fetch image as binary buffer
  const response = await fetch(manipulated.uri);
  const imageData = await response.arrayBuffer();
  const rawImageTensor = decodeJpeg(new Uint8Array(imageData));
  // console.log('Raw image tensor shape:', rawImageTensor.shape);

  // Normalize and prepare input
const normalized = tf.tidy(() => {
  const resized = tf.image.resizeBilinear(rawImageTensor, [IMAGE_SIZE, IMAGE_SIZE]);
  // console.log('Resized tensor shape:', resized.shape); // [224, 224, 3]

  const casted = resized.toFloat().div(tf.scalar(255));
  const offset = tf.tensor1d(MEAN).reshape([1, 1, 1, 3]);
  const scale = tf.tensor1d(STD).reshape([1, 1, 1, 3]);
  const norm = casted.sub(offset).div(scale); // shape: [224, 224, 3]

  // console.log('Normalized tensor shape before expandDims:', norm.shape);
  return norm // shape: [1, 224, 224, 3]
});

//  console.log('Final input tensor shape:', normalized.shape);

  // Run prediction
  // console.log('Model inputs:', model.inputs);

  const prediction = model.execute({ x: normalized }) as tf.Tensor;

  // console.log('Prediction tensor shape:', prediction.shape);

  const output = await prediction.data();
  // console.log('Raw prediction values:', output);

  // Softmax
  const expScores = Array.from(output).map(Math.exp);
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const probs = expScores.map((v) => v / sumExp);

  // Argmax
  let predictedIndex = 0;
  let maxProb = probs[0];
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > maxProb) {
      predictedIndex = i;
      maxProb = probs[i];
    }
  }

  tf.dispose([normalized, prediction]); // Clean memory

  return {
    label: CLASS_NAMES[predictedIndex],
    confidence: maxProb,
  };
}
