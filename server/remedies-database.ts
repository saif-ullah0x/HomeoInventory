/**
 * Comprehensive Homeopathic Remedies Database
 * Based on Boericke's Materia Medica and classical homeopathic literature
 * This serves as fallback data when cloud APIs are not available
 */

export interface HomeopathicRemedy {
  id: number;
  name: string;
  fullName: string;
  commonNames: string[];
  potencies: string[];
  keySymptoms: string[];
  mentalEmotional: string[];
  physical: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  dosage: string;
  frequency: string;
  source: string;
  category: string;
}

export const REMEDIES_DATABASE: HomeopathicRemedy[] = [
  {
    id: 1,
    name: "Aconite",
    fullName: "Aconitum napellus",
    commonNames: ["Monkshood", "Wolfsbane"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["sudden onset", "fear", "anxiety", "restlessness", "fever", "chill"],
    mentalEmotional: ["intense fear", "anxiety", "panic attacks", "restlessness"],
    physical: ["sudden fever", "dry cough", "headache", "sore throat"],
    modalities: {
      worse: ["cold dry wind", "evening", "night", "fright"],
      better: ["open air", "rest", "warmth"]
    },
    dosage: "2-3 pellets",
    frequency: "Every 2-4 hours",
    source: "Boericke's Materia Medica",
    category: "Acute"
  },
  {
    id: 2,
    name: "Belladonna",
    fullName: "Atropa belladonna",
    commonNames: ["Deadly Nightshade"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["sudden onset", "high fever", "throbbing pain", "red face", "dilated pupils"],
    mentalEmotional: ["delirium", "violence", "biting", "striking"],
    physical: ["throbbing headache", "high fever", "sore throat", "earache"],
    modalities: {
      worse: ["touch", "jar", "noise", "light", "afternoon"],
      better: ["semi-erect position", "light covering"]
    },
    dosage: "2-3 pellets",
    frequency: "Every 2-4 hours",
    source: "Boericke's Materia Medica",
    category: "Acute"
  },
  {
    id: 3,
    name: "Arsenicum",
    fullName: "Arsenicum album",
    commonNames: ["White Arsenic"],
    potencies: ["6C", "30C", "200C", "1M"],
    keySymptoms: ["anxiety", "restlessness", "weakness", "burning pains", "fastidious"],
    mentalEmotional: ["anxiety about health", "fear of death", "restlessness", "fastidious"],
    physical: ["burning pains", "diarrhea", "vomiting", "asthma", "skin conditions"],
    modalities: {
      worse: ["midnight", "cold", "cold drinks"],
      better: ["heat", "warm drinks", "company"]
    },
    dosage: "2-3 pellets",
    frequency: "3-4 times daily",
    source: "Boericke's Materia Medica",
    category: "Constitutional"
  },
  {
    id: 4,
    name: "Rhus tox",
    fullName: "Rhus toxicodendron",
    commonNames: ["Poison Ivy"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["restlessness", "stiffness worse on first motion", "better with continued motion"],
    mentalEmotional: ["restlessness", "anxiety at night", "weeping"],
    physical: ["joint stiffness", "muscle aches", "skin eruptions", "fever"],
    modalities: {
      worse: ["rest", "damp weather", "night", "cold"],
      better: ["motion", "warmth", "dry weather"]
    },
    dosage: "2-3 pellets",
    frequency: "3 times daily",
    source: "Boericke's Materia Medica",
    category: "Rheumatic"
  },
  {
    id: 5,
    name: "Bryonia",
    fullName: "Bryonia alba",
    commonNames: ["Wild Hops", "White Bryony"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["dryness", "irritability", "worse from motion", "thirst for cold water"],
    mentalEmotional: ["irritability", "wants to be left alone", "business anxiety"],
    physical: ["dry cough", "headache", "constipation", "joint pain"],
    modalities: {
      worse: ["motion", "heat", "touch", "morning"],
      better: ["rest", "pressure", "cool air"]
    },
    dosage: "2-3 pellets",
    frequency: "3-4 times daily",
    source: "Boericke's Materia Medica",
    category: "Constitutional"
  },
  {
    id: 6,
    name: "Pulsatilla",
    fullName: "Pulsatilla nigricans",
    commonNames: ["Wind Flower", "Pasque Flower"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["changeable symptoms", "mild disposition", "desires company", "thirstless"],
    mentalEmotional: ["mild", "yielding", "weepy", "desires sympathy", "changeable mood"],
    physical: ["changeable symptoms", "thick yellow discharge", "menstrual problems"],
    modalities: {
      worse: ["warm room", "evening", "rich food"],
      better: ["open air", "cold", "gentle motion", "sympathy"]
    },
    dosage: "2-3 pellets",
    frequency: "3 times daily",
    source: "Boericke's Materia Medica",
    category: "Constitutional"
  },
  {
    id: 7,
    name: "Nux vomica",
    fullName: "Strychnos nux-vomica",
    commonNames: ["Poison Nut"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["irritability", "oversensitivity", "digestive problems", "chilly"],
    mentalEmotional: ["irritability", "impatience", "fastidious", "workaholic"],
    physical: ["indigestion", "constipation", "headache", "insomnia"],
    modalities: {
      worse: ["morning", "cold", "spices", "stimulants", "anger"],
      better: ["warmth", "rest", "uninterrupted sleep"]
    },
    dosage: "2-3 pellets",
    frequency: "3 times daily",
    source: "Boericke's Materia Medica",
    category: "Constitutional"
  },
  {
    id: 8,
    name: "Sulphur",
    fullName: "Sulphur",
    commonNames: ["Brimstone"],
    potencies: ["6C", "30C", "200C", "1M"],
    keySymptoms: ["burning", "itching", "skin problems", "philosophical", "untidy"],
    mentalEmotional: ["philosophical", "critical", "untidy", "selfish"],
    physical: ["skin eruptions", "burning sensations", "diarrhea", "hot flashes"],
    modalities: {
      worse: ["heat", "bathing", "11 am", "standing"],
      better: ["dry warm weather", "open air"]
    },
    dosage: "2-3 pellets",
    frequency: "Once daily",
    source: "Boericke's Materia Medica",
    category: "Constitutional"
  },
  {
    id: 9,
    name: "Arnica",
    fullName: "Arnica montana",
    commonNames: ["Leopard's Bane", "Mountain Tobacco"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["trauma", "bruising", "soreness", "says he's well when sick"],
    mentalEmotional: ["says he's well", "refuses help", "fear of being touched"],
    physical: ["bruises", "sprains", "trauma", "muscle soreness", "black eye"],
    modalities: {
      worse: ["touch", "motion", "damp cold"],
      better: ["rest", "lying down"]
    },
    dosage: "2-3 pellets",
    frequency: "Every 2-4 hours after injury",
    source: "Boericke's Materia Medica",
    category: "Trauma"
  },
  {
    id: 10,
    name: "Hepar sulph",
    fullName: "Hepar sulphuris calcareum",
    commonNames: ["Calcium Sulphide"],
    potencies: ["6C", "30C", "200C"],
    keySymptoms: ["suppuration", "oversensitive", "chilly", "splinter-like pains"],
    mentalEmotional: ["irritable", "oversensitive", "hasty", "quarrelsome"],
    physical: ["abscesses", "boils", "sore throat", "croupy cough"],
    modalities: {
      worse: ["cold", "draft", "touch", "slightest draft"],
      better: ["warmth", "wrapping up warmly", "damp weather"]
    },
    dosage: "2-3 pellets",
    frequency: "3-4 times daily",
    source: "Boericke's Materia Medica",
    category: "Suppuration"
  }
];

/**
 * Search remedies by symptoms with confidence scoring
 */
export function searchRemediesBySymptoms(symptoms: string): Array<{remedy: HomeopathicRemedy, confidence: number}> {
  const symptomWords = symptoms.toLowerCase().split(/\s+|[,;.!?]/);
  const matches: Array<{remedy: HomeopathicRemedy, confidence: number}> = [];
  
  REMEDIES_DATABASE.forEach(remedy => {
    let score = 0;
    let maxScore = 0;
    
    // Check key symptoms (highest weight)
    remedy.keySymptoms.forEach(keySymptom => {
      maxScore += 20;
      if (symptomWords.some(word => keySymptom.toLowerCase().includes(word) || word.includes(keySymptom.toLowerCase()))) {
        score += 20;
      }
    });
    
    // Check physical symptoms
    remedy.physical.forEach(physical => {
      maxScore += 15;
      if (symptomWords.some(word => physical.toLowerCase().includes(word) || word.includes(physical.toLowerCase()))) {
        score += 15;
      }
    });
    
    // Check mental/emotional symptoms
    remedy.mentalEmotional.forEach(mental => {
      maxScore += 10;
      if (symptomWords.some(word => mental.toLowerCase().includes(word) || word.includes(mental.toLowerCase()))) {
        score += 10;
      }
    });
    
    // Check modalities
    remedy.modalities.worse.forEach(worse => {
      maxScore += 5;
      if (symptomWords.some(word => worse.toLowerCase().includes(word) || word.includes(worse.toLowerCase()))) {
        score += 5;
      }
    });
    
    if (score > 0 && maxScore > 0) {
      const confidence = Math.round((score / maxScore) * 100);
      if (confidence >= 30) { // Only include matches with reasonable confidence
        matches.push({ remedy, confidence: Math.min(confidence, 95) });
      }
    }
  });
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get remedy by name
 */
export function getRemedyByName(name: string): HomeopathicRemedy | undefined {
  return REMEDIES_DATABASE.find(remedy => 
    remedy.name.toLowerCase() === name.toLowerCase() ||
    remedy.fullName.toLowerCase() === name.toLowerCase() ||
    remedy.commonNames.some(common => common.toLowerCase() === name.toLowerCase())
  );
}