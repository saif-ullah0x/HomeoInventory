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

// Generate motivational and supportive messages
function getMotivationalMessage(symptoms: string): string {
  const symptomsLower = symptoms.toLowerCase();
  
  if (symptomsLower.includes('tired') || symptomsLower.includes('exhausted') || symptomsLower.includes('fatigue')) {
    return "💪 You are stronger than you think! Rest is not just important—it's essential for healing. Take time to nurture yourself, you're doing great! 🌟";
  }
  
  if (symptomsLower.includes('anxious') || symptomsLower.includes('anxiety') || symptomsLower.includes('worried') || symptomsLower.includes('stress')) {
    return "🌸 Take a deep breath—you've overcome challenges before, and you'll get through this too. You are resilient and capable! Remember, healing takes time. 💙";
  }
  
  if (symptomsLower.includes('pain') || symptomsLower.includes('hurt') || symptomsLower.includes('ache')) {
    return "🌈 Your body is wise and knows how to heal. This discomfort is temporary—you're on your journey to feeling better! Stay hopeful and gentle with yourself. ✨";
  }
  
  if (symptomsLower.includes('sad') || symptomsLower.includes('depressed') || symptomsLower.includes('grief') || symptomsLower.includes('cry')) {
    return "🤗 It's okay to feel what you're feeling. Your emotions are valid, and healing happens one day at a time. You are loved and you matter! 💕";
  }
  
  if (symptomsLower.includes('sleep') || symptomsLower.includes('insomnia') || symptomsLower.includes('rest')) {
    return "🌙 Good sleep is like a reset button for your body and mind. You deserve peaceful rest—your healing journey includes taking care of yourself! 😴";
  }
  
  if (symptomsLower.includes('digest') || symptomsLower.includes('stomach') || symptomsLower.includes('nausea')) {
    return "🌿 Listen to your body's wisdom. Gentle nourishment and patience will help restore your natural balance. You're taking good care of yourself! 🌱";
  }
  
  // Default motivational message
  return "🌟 Your body has amazing healing power! Taking care of yourself with homeopathy shows how much you value your wellbeing. Keep going—you're doing wonderfully! 💚";
}

// Generate AI response based on matched remedies
export function generateHomeopathicResponse(symptoms: string, matches: HomeopathicRemedy[]) {
  const motivationalMsg = getMotivationalMessage(symptoms);
  
  if (matches.length === 0) {
    return {
      response: `${motivationalMsg}\n\nI'd love to help you find the right remedy! Could you share a bit more detail about your symptoms? For example:\n\n• When do you feel worse or better?\n• How are you feeling emotionally?\n• Any specific physical sensations?\n• What might have triggered this?\n\nThe more details you share, the better I can match you with classical remedies! 💝`,
      remedies: []
    };
  }

  const topMatch = matches[0];
  const response = `${motivationalMsg}\n\nBased on your symptoms and classical homeopathic materia medica, I found some wonderful remedies that may help! 🌿\n\nThe primary remedy that comes to mind is **${topMatch.name}**, which is beautifully indicated for symptoms like yours according to ${topMatch.sources[0]}.\n\nRemember, homeopathy works gently with your body's natural healing ability! 💙`;

  const remedies = matches.map(remedy => ({
    name: remedy.name,
    potency: remedy.potencies[1] || "30C", // Default to 30C
    indication: remedy.keySymptoms.slice(0, 2).join(", "),
    reasoning: `This gentle remedy matches your symptom pattern beautifully: ${remedy.keySymptoms[0]}`,
    source: remedy.sources[0]
  }));

  return { response, remedies };
}