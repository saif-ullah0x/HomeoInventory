// Comprehensive Homeopathic Knowledge Base
// Based on classical works by Kent, Boericke, Clarke, and other established sources

interface HomeopathicRemedy {
  name: string;
  commonNames?: string[];
  keySymptoms: string[];
  mentalEmotional: string[];
  physical: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potencies: string[];
  sources: string[];
}

export const HOMEOPATHIC_REMEDIES: HomeopathicRemedy[] = [
  {
    name: "Aconitum Napellus",
    commonNames: ["Aconite", "Monkshood"],
    keySymptoms: [
      "sudden onset after shock or fright",
      "intense fear and anxiety",
      "restlessness and agitation",
      "fever with chills",
      "dry burning skin"
    ],
    mentalEmotional: [
      "extreme anxiety and fear",
      "fear of death",
      "panic attacks",
      "restlessness",
      "irritability from pain"
    ],
    physical: [
      "sudden onset fever",
      "dry cough",
      "palpitations",
      "headache with fear",
      "eye inflammation"
    ],
    modalities: {
      worse: ["evening", "night", "warm room", "music", "tobacco smoke"],
      better: ["open air", "rest"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Arnica Montana",
    commonNames: ["Arnica", "Mountain Daisy"],
    keySymptoms: [
      "trauma and injury",
      "bruised sore feeling",
      "overexertion",
      "muscle soreness",
      "refuses help saying he is fine"
    ],
    mentalEmotional: [
      "says nothing is wrong when clearly hurt",
      "fear of being touched",
      "indifference",
      "absent-mindedness",
      "hopelessness"
    ],
    physical: [
      "bruises and contusions",
      "muscle soreness",
      "sprains",
      "post-operative pain",
      "nosebleeds"
    ],
    modalities: {
      worse: ["touch", "motion", "dampness", "wine"],
      better: ["lying down", "rest"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Clarke's Materia Medica"]
  },
  {
    name: "Belladonna",
    commonNames: ["Deadly Nightshade"],
    keySymptoms: [
      "sudden violent onset",
      "burning heat and redness",
      "throbbing pain",
      "high fever with delirium",
      "hypersensitivity to light and noise"
    ],
    mentalEmotional: [
      "delirium with fever",
      "violent behavior",
      "biting and striking",
      "fear of imaginary things",
      "restless sleep with nightmares"
    ],
    physical: [
      "intense headache",
      "high fever",
      "red flushed face",
      "dilated pupils",
      "sore throat"
    ],
    modalities: {
      worse: ["touch", "jar", "noise", "light", "afternoon"],
      better: ["semi-erect position", "rest"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Bryonia Alba",
    commonNames: ["White Bryony"],
    keySymptoms: [
      "worse from any motion",
      "great thirst for large quantities",
      "irritability",
      "dryness of mucous membranes",
      "stitching pains"
    ],
    mentalEmotional: [
      "extreme irritability",
      "wants to be left alone",
      "anxiety about business",
      "delirium about business",
      "fear of poverty"
    ],
    physical: [
      "headache worse from motion",
      "dry cough",
      "constipation",
      "rheumatic pains",
      "pleurisy"
    ],
    modalities: {
      worse: ["motion", "warmth", "morning", "eating"],
      better: ["pressure", "lying on painful side", "rest", "cool air"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Gelsemium Sempervirens",
    commonNames: ["Yellow Jasmine"],
    keySymptoms: [
      "drowsiness and dullness",
      "trembling from weakness",
      "anticipatory anxiety",
      "drooping eyelids",
      "dizziness"
    ],
    mentalEmotional: [
      "anticipatory anxiety",
      "fear of falling",
      "dullness and confusion",
      "lack of confidence",
      "trembling from emotion"
    ],
    physical: [
      "influenza",
      "headache at base of skull",
      "heavy drooping eyelids",
      "muscle weakness",
      "vertigo"
    ],
    modalities: {
      worse: ["damp weather", "emotion", "excitement", "bad news"],
      better: ["open air", "stimulants", "profuse urination"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Clarke's Materia Medica"]
  },
  {
    name: "Nux Vomica",
    commonNames: ["Poison Nut"],
    keySymptoms: [
      "oversensitive to everything",
      "irritable and impatient",
      "digestive problems from excess",
      "chilly",
      "constant urging for stool"
    ],
    mentalEmotional: [
      "extremely irritable",
      "impatient",
      "fastidious",
      "fault-finding",
      "oversensitive to noise, odors, light"
    ],
    physical: [
      "indigestion",
      "constipation with urging",
      "headache from excess",
      "insomnia",
      "cramping pains"
    ],
    modalities: {
      worse: ["morning", "mental exertion", "cold air", "spices", "stimulants"],
      better: ["evening", "rest", "warmth", "milk"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Pulsatilla Pratensis",
    commonNames: ["Wind Flower", "Pasque Flower"],
    keySymptoms: [
      "changeability of symptoms",
      "mild and yielding disposition",
      "worse in warm room",
      "thirstless",
      "thick yellow-green discharges"
    ],
    mentalEmotional: [
      "mild, gentle, yielding",
      "weeps easily",
      "changeable moods",
      "desires sympathy",
      "fear of abandonment"
    ],
    physical: [
      "shifting pains",
      "thick yellow discharges",
      "digestive problems",
      "hormonal issues",
      "varicose veins"
    ],
    modalities: {
      worse: ["warm room", "evening", "fatty foods", "getting feet wet"],
      better: ["open air", "motion", "cold applications", "sympathy"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Rhus Toxicodendron",
    commonNames: ["Poison Ivy"],
    keySymptoms: [
      "restlessness with painful stiffness",
      "better from motion",
      "worse from rest",
      "red swollen skin",
      "great thirst"
    ],
    mentalEmotional: [
      "extreme restlessness",
      "anxiety worse at night",
      "mild delirium",
      "weeping without cause",
      "thoughts of suicide"
    ],
    physical: [
      "joint stiffness better from motion",
      "skin eruptions with itching",
      "muscle strain",
      "cellulitis",
      "herpes"
    ],
    modalities: {
      worse: ["rest", "cold wet weather", "night", "initial motion"],
      better: ["continued motion", "warmth", "dry weather"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Clarke's Materia Medica"]
  },
  {
    name: "Sulphur",
    commonNames: ["Brimstone"],
    keySymptoms: [
      "burning sensations",
      "untidy appearance",
      "worse from heat",
      "offensive odors",
      "philosophical mind"
    ],
    mentalEmotional: [
      "philosophical and theoretical",
      "absent-minded",
      "selfish",
      "critical of others",
      "lazy"
    ],
    physical: [
      "skin conditions with burning",
      "offensive discharges",
      "hot flashes",
      "burning feet",
      "digestive problems"
    ],
    modalities: {
      worse: ["heat", "washing", "standing", "11 AM", "night"],
      better: ["dry warm weather", "open air", "motion"]
    },
    potencies: ["6C", "30C", "200C", "1M"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  },
  {
    name: "Ignatia Amara",
    commonNames: ["St. Ignatius Bean"],
    keySymptoms: [
      "grief and emotional shock",
      "contradictory symptoms",
      "sighing and sobbing",
      "sensation of lump in throat",
      "hysterical behavior"
    ],
    mentalEmotional: [
      "grief from loss",
      "suppressed emotions",
      "mood swings",
      "sighing frequently",
      "hysterical reactions"
    ],
    physical: [
      "headache like a nail",
      "globus sensation in throat",
      "spasmodic cough",
      "muscle twitching",
      "insomnia from grief"
    ],
    modalities: {
      worse: ["emotion", "coffee", "tobacco", "open air"],
      better: ["eating", "hard pressure", "lying on painful side"]
    },
    potencies: ["6C", "30C", "200C"],
    sources: ["Kent's Materia Medica", "Boericke's Materia Medica"]
  }
];

// Symptom matching algorithms
export function findRemediesBySymptoms(symptoms: string): HomeopathicRemedy[] {
  const normalizedSymptoms = symptoms.toLowerCase();
  const matches: Array<{ remedy: HomeopathicRemedy; score: number }> = [];

  for (const remedy of HOMEOPATHIC_REMEDIES) {
    let score = 0;
    
    // Check key symptoms
    for (const keySymptom of remedy.keySymptoms) {
      if (normalizedSymptoms.includes(keySymptom.toLowerCase())) {
        score += 5;
      }
    }
    
    // Check mental/emotional symptoms
    for (const mentalSymptom of remedy.mentalEmotional) {
      if (normalizedSymptoms.includes(mentalSymptom.toLowerCase())) {
        score += 4;
      }
    }
    
    // Check physical symptoms
    for (const physicalSymptom of remedy.physical) {
      if (normalizedSymptoms.includes(physicalSymptom.toLowerCase())) {
        score += 3;
      }
    }
    
    // Partial word matching for better results
    const words = normalizedSymptoms.split(/\s+/);
    for (const word of words) {
      if (word.length > 3) {
        for (const keySymptom of remedy.keySymptoms) {
          if (keySymptom.toLowerCase().includes(word)) {
            score += 2;
          }
        }
      }
    }
    
    if (score > 0) {
      matches.push({ remedy, score });
    }
  }
  
  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(match => match.remedy);
}

// Generate AI response based on matched remedies
export function generateHomeopathicResponse(symptoms: string, matches: HomeopathicRemedy[]) {
  if (matches.length === 0) {
    return {
      response: "I couldn't find specific remedies for those symptoms in my classical materia medica database. Could you please describe your symptoms in more detail? For example, mention:\n\n• When symptoms are worse or better\n• How you're feeling emotionally\n• Any physical sensations\n• What triggered the symptoms",
      remedies: []
    };
  }

  const topMatch = matches[0];
  const response = `Based on your symptoms and classical homeopathic materia medica, here are some remedies that may be helpful:\n\nThe primary remedy that comes to mind is **${topMatch.name}**, which is particularly indicated for symptoms like yours according to ${topMatch.sources[0]}.`;

  const remedies = matches.map(remedy => ({
    name: remedy.name,
    potency: remedy.potencies[1] || "30C", // Default to 30C
    indication: remedy.keySymptoms.slice(0, 2).join(", "),
    reasoning: `This remedy matches your symptom pattern, particularly: ${remedy.keySymptoms[0]}`,
    source: remedy.sources[0]
  }));

  return { response, remedies };
}