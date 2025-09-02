
export type Diagnosis = {
  id: string;
  lesionType: string;
  confidence: number;
  date: string;       // ISO date string
  image: string;      // local uri or asset
};
