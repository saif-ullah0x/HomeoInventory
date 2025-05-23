// Symptom-Based Medicine Database from PDF: "List of Homoeopathic Medicines Combinations & Their Uses"
// This contains structured homeopathic guidance with specific medicine combinations for each condition

export interface SymptomMedicineGuide {
  id: number;
  condition: string;
  category: string;
  medicines: MedicineRecommendation[];
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface MedicineRecommendation {
  name: string;
  potency: string;
  drops: number;
  company?: string;
  alternativeName?: string;
}

export const SYMPTOM_MEDICINE_DATABASE: SymptomMedicineGuide[] = [
  // GENERAL AILMENTS
  {
    id: 1,
    condition: "Pain, swelling, fever due to cold exposure/injury/fall",
    category: "General Ailments",
    medicines: [
      { name: "Aconite", potency: "30", drops: 1 },
      { name: "Bryonia", potency: "30", drops: 1 },
      { name: "Belladonna", potency: "30", drops: 1 },
      { name: "Ferrum phos", potency: "30", drops: 1 },
      { name: "Gelsemium", potency: "30", drops: 1 }
    ],
    dosage: "Mix all medicines as SINGLE DOSE in ½ cup lukewarm water",
    frequency: "Initially every ½ hour, then 1-2-3-4 hourly interval (8-6-4-3 times a day)",
    notes: "Alternative: Aconitum Pentarkan 1-2 tablets in ¼ cup lukewarm water"
  },
  
  {
    id: 2,
    condition: "Pain killers-cum-healers in case of accident, fall, injury, fracture",
    category: "General Ailments",
    medicines: [
      { name: "R-1", potency: "liquid", drops: 10, company: "Dr Reckeweg & Co., Germany" }
    ],
    dosage: "10 drops in ½ cup water",
    frequency: "Every ½ hour initially, then gradually increase intervals",
    notes: "For external local massage and internal use"
  },

  {
    id: 3,
    condition: "High Blood Pressure",
    category: "General Ailments", 
    medicines: [
      { name: "R-85", potency: "liquid", drops: 10, company: "Dr Reckeweg & Co., Germany" }
    ],
    dosage: "10 drops in ½ cup water",
    frequency: "3 times a day (Empty Stomach 6AM, 3PM, Bedtime)",
    notes: "Continue for several weeks for sustained effect"
  },

  {
    id: 4,
    condition: "One side paralysis of body (Hemiplegia) following high BP",
    category: "General Ailments",
    medicines: [
      { name: "R-85", potency: "liquid", drops: 10, company: "Dr Reckeweg & Co., Germany" },
      { name: "Causticum", potency: "200", drops: 4 },
      { name: "Lachesis", potency: "200", drops: 4 }
    ],
    dosage: "Take R-85 in morning, other medicines in evening",
    frequency: "R-85: Morning; Causticum + Lachesis: Evening",
    notes: "Give 1 hour gap between different medicines"
  },

  {
    id: 5,
    condition: "Depression and Anxiety due to tension/menopause/heart problems",
    category: "General Ailments",
    medicines: [
      { name: "Ignatia", potency: "30", drops: 4 },
      { name: "Natrum mur", potency: "30", drops: 4 },
      { name: "Sepia", potency: "30", drops: 4 },
      { name: "Pulsatilla", potency: "30", drops: 4 }
    ],
    dosage: "Mix all as SINGLE DOSE in ½ cup water",
    frequency: "3 times a day",
    notes: "Especially effective for emotional stress and hormonal changes"
  },

  {
    id: 6,
    condition: "Diabetes (Sugar in Urine)",
    category: "General Ailments",
    medicines: [
      { name: "Uranium nit", potency: "30", drops: 4 },
      { name: "Phosphoric acid", potency: "30", drops: 4 },
      { name: "Syzygium jambolanum", potency: "Q", drops: 10 }
    ],
    dosage: "Take separately with 15 minutes gap",
    frequency: "Uranium nit & Phosphoric acid: 3 times daily; Syzygium: 4 times daily",
    notes: "Monitor blood sugar regularly"
  },

  {
    id: 7,
    condition: "Thyroid Problem",
    category: "General Ailments",
    medicines: [
      { name: "Thyroidinum", potency: "30", drops: 4 },
      { name: "Calcarea carb", potency: "30", drops: 4 },
      { name: "Iodum", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "2-3 times a day",
    notes: "For both hyper and hypothyroid conditions"
  },

  // JOINT PAINS (LOCOMOTOR SYSTEM)
  {
    id: 8,
    condition: "Uric acid Diathesis (high Uric Acid in serum leading to pain in joints)",
    category: "Joint Pains",
    medicines: [
      { name: "Colchicum", potency: "30", drops: 4 },
      { name: "Ledum pal", potency: "30", drops: 4 },
      { name: "Urtica urens", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "3-4 times a day",
    notes: "Avoid purine-rich foods"
  },

  {
    id: 9,
    condition: "Rheumatoid Arthritis",
    category: "Joint Pains",
    medicines: [
      { name: "Rhus tox", potency: "30", drops: 4 },
      { name: "Bryonia", potency: "30", drops: 4 },
      { name: "Calcarea carb", potency: "30", drops: 4 },
      { name: "Causticum", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "3 times a day",
    notes: "Better from motion (Rhus tox) vs worse from motion (Bryonia)"
  },

  // FACE & SKIN
  {
    id: 10,
    condition: "Pimples/Acne problem",
    category: "Face & Skin",
    medicines: [
      { name: "Kali brom", potency: "30", drops: 4 },
      { name: "Hepar sulph", potency: "30", drops: 4 },
      { name: "Sulphur", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "3 times a day",
    notes: "Avoid oily foods and maintain good skin hygiene"
  },

  {
    id: 11,
    condition: "Psoriasis, Eczema causing itching",
    category: "Face & Skin", 
    medicines: [
      { name: "Arsenicum alb", potency: "30", drops: 4 },
      { name: "Sulphur", potency: "30", drops: 4 },
      { name: "Graphites", potency: "30", drops: 4 },
      { name: "Petroleum", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "3 times a day",
    notes: "Chronic skin conditions require patient treatment"
  },

  {
    id: 12,
    condition: "Ring worm/Fungal infection leading to itching",
    category: "Face & Skin",
    medicines: [
      { name: "Sepia", potency: "30", drops: 4 },
      { name: "Sulphur", potency: "30", drops: 4 },
      { name: "Tellurium", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water", 
    frequency: "3 times a day",
    notes: "Keep affected area clean and dry"
  },

  {
    id: 13,
    condition: "Urticaria (Pitti)",
    category: "Face & Skin",
    medicines: [
      { name: "Apis mel", potency: "30", drops: 4 },
      { name: "Urtica urens", potency: "30", drops: 4 },
      { name: "Dulcamara", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "Every 2 hours initially, then 3 times daily",
    notes: "Allergic skin reaction with swelling and itching"
  },

  // RESPIRATORY TRACT
  {
    id: 14,
    condition: "Sinusitis, Influenza/Viral Fever/Common cold",
    category: "Upper Respiratory Tract",
    medicines: [
      { name: "ADEL 20 (Proaller)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "ADEL 23 (Ricura)", potency: "liquid", drops: 10, company: "Adelmar Pharma" }
    ],
    dosage: "10 drops each in ½ cup water", 
    frequency: "4 times a day",
    notes: "For nasal allergy, hay fever, runny nose, sneezing"
  },

  {
    id: 15,
    condition: "Tonsillitis: Pain on swallowing & Fever",
    category: "Upper Respiratory Tract",
    medicines: [
      { name: "Tonsiotren", potency: "tablets", drops: 2, company: "Dr Willmar Schwabe" },
      { name: "ADEL 24 (septosil)", potency: "liquid", drops: 10, company: "Adelmar Pharma" }
    ],
    dosage: "Tonsiotren: 2 tablets; ADEL 24: 10 drops in water",
    frequency: "Every 2 hours initially, then 4 times daily",
    notes: "Alternative treatments for throat infection"
  },

  {
    id: 16,
    condition: "Cough & Cold: Bronchitis, Difficulty in Breathing", 
    category: "Lower Respiratory Tract",
    medicines: [
      { name: "ADEL 7 (apo-Tuss)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "Drosera", potency: "30", drops: 4 },
      { name: "Bryonia", potency: "30", drops: 4 },
      { name: "Antimonium tart", potency: "30", drops: 4 }
    ],
    dosage: "ADEL 7 separately, other medicines as single dose",
    frequency: "4-6 times a day",
    notes: "For spasmodic cough and bronchial congestion"
  },

  // DIGESTIVE SYSTEM
  {
    id: 17,
    condition: "Stomach Problems: Acidity, Gastric ulcer, Eructation/Belching",
    category: "Upper Abdomen",
    medicines: [
      { name: "ADEL 5 (apo-Stom)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "Nux vomica", potency: "30", drops: 4 },
      { name: "Lycopodium", potency: "30", drops: 4 },
      { name: "Carbo veg", potency: "30", drops: 4 }
    ],
    dosage: "ADEL 5: 10 drops; Others as single dose",
    frequency: "3-4 times a day",
    notes: "For hyperacidity and digestive problems"
  },

  {
    id: 18,
    condition: "Food Poisoning/Intestinal infection (Vomiting/Diarrhea with Fever)",
    category: "Lower Abdomen", 
    medicines: [
      { name: "Arsenicum alb", potency: "200", drops: 4, company: "Dr Willmar Schwabe" },
      { name: "Podophyllum", potency: "1M", drops: 4, company: "Dr Willmar Schwabe" }
    ],
    dosage: "Give separately with 15 minutes gap",
    frequency: "Every 1-2 hours initially",
    notes: "For severe gastroenteritis and food poisoning"
  },

  {
    id: 19,
    condition: "Colic/Cramps, Amoebisis/Dysentery (Blood in stool)",
    category: "Lower Abdomen",
    medicines: [
      { name: "Colocynthis", potency: "30", drops: 4 },
      { name: "Mag phos", potency: "30", drops: 4 },
      { name: "Mercurius cor", potency: "30", drops: 4 },
      { name: "Aloe", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "Every 2-3 hours",
    notes: "For intestinal cramps and dysenteric stools"
  },

  // URINARY TRACT
  {
    id: 20,
    condition: "UTI (Urinary Tract Infection), Kidney Stone & Blood in urine",
    category: "Urinary Tract",
    medicines: [
      { name: "ADEL 22 (Renelix)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "ADEL 29 (Akutur)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "Berberis vul", potency: "30", drops: 4 },
      { name: "Cantharis", potency: "30", drops: 4 }
    ],
    dosage: "ADEL medicines: 10 drops each; Others as single dose",
    frequency: "4-6 times a day",
    notes: "Increase water intake, maintain hygiene"
  },

  // FEMALE PROBLEMS
  {
    id: 21,
    condition: "Female Problems: Uterine health, Leucorrhoea, Menstruation & sex problems",
    category: "Female Sexual Problems",
    medicines: [
      { name: "Sepia", potency: "30", drops: 4 },
      { name: "Pulsatilla", potency: "30", drops: 4 },
      { name: "Sabina", potency: "30", drops: 4 },
      { name: "Calcarea carb", potency: "30", drops: 4 }
    ],
    dosage: "Mix as SINGLE DOSE in ½ cup water",
    frequency: "3 times a day",
    notes: "For hormonal balance and reproductive health"
  },

  {
    id: 22,
    condition: "Pregnancy nausea, Vomiting",
    category: "Female Sexual Problems",
    medicines: [
      { name: "Symphoricarpus", potency: "30", drops: 4, company: "Dr Willmar Schwabe" },
      { name: "Tabacum", potency: "30", drops: 4, company: "Dr Willmar Schwabe" },
      { name: "Ipecac", potency: "30", drops: 4 }
    ],
    dosage: "Take individually or as combination",
    frequency: "As needed for nausea",
    notes: "Safe during pregnancy, consult healthcare provider"
  },

  // HEADACHE & PAIN
  {
    id: 23,
    condition: "Headache, pain in body/legs",
    category: "General Pain",
    medicines: [
      { name: "ADEL 1 (apo-Dolor)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "Belladonna", potency: "30", drops: 4 },
      { name: "Bryonia", potency: "30", drops: 4 },
      { name: "Gelsemium", potency: "30", drops: 4 }
    ],
    dosage: "ADEL 1: 10 drops; Others as single dose",
    frequency: "Every 2-4 hours as needed",
    notes: "For various types of pain and headaches"
  },

  // TRAVEL SICKNESS
  {
    id: 24,
    condition: "Nausea, Vomiting, travel sickness",
    category: "General Ailments",
    medicines: [
      { name: "R-52", potency: "liquid", drops: 10, company: "Dr Reckeweg & Co." },
      { name: "Cocculus", potency: "30", drops: 4 },
      { name: "Petroleum", potency: "30", drops: 4 }
    ],
    dosage: "R-52: 10 drops in water; Others as combination",
    frequency: "Before travel and as needed",
    notes: "Take 30 minutes before traveling"
  },

  // ALLERGY CONDITIONS
  {
    id: 25,
    condition: "Eye Flu, Eye Allergy, Nasal Allergy, Asthma/Sinusitis",
    category: "Eyes, Ear, Nose, Teeth & Throat",
    medicines: [
      { name: "R-84", potency: "liquid", drops: 10, company: "Dr Reckeweg & Co." },
      { name: "ADEL 20 (Proaller)", potency: "liquid", drops: 10, company: "Adelmar Pharma" },
      { name: "Euphrasia", potency: "30", drops: 4 },
      { name: "Allium cepa", potency: "30", drops: 4 }
    ],
    dosage: "Each medicine separately with 15 minutes gap",
    frequency: "4 times a day",
    notes: "For inhalant allergies and seasonal reactions"
  },

  // EAR PROBLEMS
  {
    id: 26,
    condition: "Earache due to swelling/Infection leading to vertigo and pain in ear",
    category: "Eyes, Ear, Nose, Teeth & Throat",
    medicines: [
      { name: "Kali mur", potency: "6x", drops: 4, company: "Dr Willmar Schwabe" },
      { name: "Kali mur", potency: "30", drops: 4 },
      { name: "Pulsatilla", potency: "30", drops: 4 },
      { name: "Belladonna", potency: "30", drops: 4 }
    ],
    dosage: "Kali mur 6x: 4 times daily; Others as single dose",
    frequency: "Every 2-3 hours for acute pain",
    notes: "For middle ear infections and pain"
  }
];

// Function to search medicines by symptoms/condition
export function searchMedicinesBySymptoms(symptoms: string): SymptomMedicineGuide[] {
  const normalizedSymptoms = symptoms.toLowerCase();
  const matches: Array<{ guide: SymptomMedicineGuide; score: number }> = [];

  for (const guide of SYMPTOM_MEDICINE_DATABASE) {
    let score = 0;
    
    // Check condition name
    if (guide.condition.toLowerCase().includes(normalizedSymptoms)) {
      score += 10;
    }
    
    // Check individual words in symptoms against condition
    const symptomWords = normalizedSymptoms.split(/\s+/).filter(word => word.length > 3);
    for (const word of symptomWords) {
      if (guide.condition.toLowerCase().includes(word)) {
        score += 5;
      }
      
      // Check against medicine names
      for (const medicine of guide.medicines) {
        if (medicine.name.toLowerCase().includes(word)) {
          score += 3;
        }
      }
      
      // Check category
      if (guide.category.toLowerCase().includes(word)) {
        score += 2;
      }
    }
    
    if (score > 0) {
      matches.push({ guide, score });
    }
  }
  
  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(match => match.guide);
}

// Get medicine guide by condition
export function getMedicineGuideByCondition(condition: string): SymptomMedicineGuide | undefined {
  return SYMPTOM_MEDICINE_DATABASE.find(guide => 
    guide.condition.toLowerCase().includes(condition.toLowerCase())
  );
}