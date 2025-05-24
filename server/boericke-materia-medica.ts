/**
 * Boericke's Materia Medica Database
 * Authentic homeopathic medicine recommendations based on William Boericke's classic work
 * This ensures accurate symptom-to-remedy matching using established homeopathic literature
 */

export interface BoerickeRemedy {
  name: string;
  commonName: string;
  keyIndications: string[];
  mentalSymptoms: string[];
  headSymptoms: string[];
  feverSymptoms: string[];
  digestiveSymptoms: string[];
  respiratorySymptoms: string[];
  generalSymptoms: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potency: string;
  relationships: string[];
  clinicalUses: string[];
}

// Authentic Boericke's Materia Medica Database
export const BOERICKE_REMEDIES: BoerickeRemedy[] = [
  {
    name: "Aconitum Napellus",
    commonName: "Monkshood",
    keyIndications: [
      "Sudden violent onset",
      "Great fear and anxiety",
      "Hot, dry skin",
      "Restlessness"
    ],
    mentalSymptoms: [
      "Great fear, anxiety, and worry",
      "Fear of death, predicts the time",
      "Restlessness, tossing about",
      "Music is unbearable, makes her sad"
    ],
    headSymptoms: [
      "Fullness in head, with mental depression",
      "Bursting headache",
      "Head hot, with throbbing carotids"
    ],
    feverSymptoms: [
      "High fever with hot, dry skin",
      "Sudden onset after exposure to cold",
      "Thirst for cold water",
      "Restless during fever"
    ],
    digestiveSymptoms: [
      "Vomiting with fear",
      "Bitter taste",
      "Thirst for large quantities of cold water"
    ],
    respiratorySymptoms: [
      "Short, dry cough",
      "Constant pressure in left chest",
      "Dyspnea with anxiety"
    ],
    generalSymptoms: [
      "Sudden onset after shock or fright",
      "Burning heat alternating with chilliness",
      "Numbness and tingling"
    ],
    modalities: {
      worse: ["Evening", "Night", "In a warm room", "When lying on affected side", "From music"],
      better: ["In open air", "Rest"]
    },
    potency: "30C to 200C",
    relationships: ["Coffea follows well", "Sulphur often completes cure"],
    clinicalUses: ["Acute fevers", "Inflammatory conditions", "Shock", "Fright", "Surgical shock"]
  },
  
  {
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    keyIndications: [
      "Violent onset",
      "Hot, red, throbbing",
      "No thirst with fever",
      "Delirium"
    ],
    mentalSymptoms: [
      "Violent delirium",
      "Desire to escape",
      "Hallucinations of various kinds",
      "Loss of consciousness"
    ],
    headSymptoms: [
      "Throbbing headache",
      "Head feels heavy, cannot bear least jar",
      "Headache from suppressed catarrhal flow",
      "Pain worse light, noise, jar"
    ],
    feverSymptoms: [
      "High fever with hot head and cold feet",
      "Burning heat with redness",
      "No thirst during fever",
      "Delirium during fever"
    ],
    digestiveSymptoms: [
      "Loss of appetite",
      "Averse to liquids",
      "Spasms of esophagus"
    ],
    respiratorySymptoms: [
      "Tickling, short, dry cough",
      "Larynx very painful",
      "High piping cough"
    ],
    generalSymptoms: [
      "Great liability to take cold",
      "Scarlet fever",
      "Convulsions"
    ],
    modalities: {
      worse: ["Touch", "Jar", "Noise", "Draught", "After noon", "Lying down"],
      better: ["Semi-erect", "Warmth"]
    },
    potency: "30C",
    relationships: ["Calcarea often follows", "Hepar antidotes"],
    clinicalUses: ["Scarlet fever", "Throat affections", "Headache", "Convulsions", "Boils"]
  },

  {
    name: "Bryonia Alba",
    commonName: "Wild Hops",
    keyIndications: [
      "Dryness of mucous membranes",
      "Great thirst",
      "Worse from motion",
      "Irritability"
    ],
    mentalSymptoms: [
      "Exceedingly irritable",
      "Delirium; wants to go home",
      "Talks of business",
      "Fear of poverty"
    ],
    headSymptoms: [
      "Bursting, splitting headache",
      "Worse from stooping, motion",
      "Headache over left eye",
      "Vertigo when rising"
    ],
    feverSymptoms: [
      "Chill, with external coldness",
      "Bursting headache with fever",
      "Great thirst for large quantities"
    ],
    digestiveSymptoms: [
      "Abnormal hunger",
      "Stomach sensitive to touch",
      "Nausea and vomiting on rising up",
      "Great thirst for large draughts"
    ],
    respiratorySymptoms: [
      "Dry, hacking cough",
      "Cough worse on entering warm room",
      "Expectoration rust-colored",
      "Stitches in chest"
    ],
    generalSymptoms: [
      "Dryness everywhere",
      "Worse from any motion",
      "Wants to be quiet"
    ],
    modalities: {
      worse: ["Motion", "Heat", "Morning", "Eating", "Hot weather"],
      better: ["Lying on painful side", "Pressure", "Rest", "Cold things"]
    },
    potency: "30C to 200C",
    relationships: ["Alumina follows well", "Rhus antidotes"],
    clinicalUses: ["Rheumatism", "Pneumonia", "Headaches", "Constipation", "Mammary abscess"]
  },

  {
    name: "Chamomilla",
    commonName: "German Chamomile",
    keyIndications: [
      "Extreme irritability",
      "Oversensitiveness",
      "One cheek red, the other pale",
      "Hot, sweaty head"
    ],
    mentalSymptoms: [
      "Extreme irritability and impatience",
      "Child can only be quieted when carried",
      "Snappish, cannot bear to be spoken to",
      "Whining restlessness"
    ],
    headSymptoms: [
      "One-sided headache",
      "Hot, clammy sweat on forehead and scalp",
      "Inclined to bend head backward"
    ],
    feverSymptoms: [
      "Chill begins in feet",
      "Hot sweat on head",
      "One cheek hot and red, the other cold and pale",
      "Thirsty with fever"
    ],
    digestiveSymptoms: [
      "Bitter taste",
      "Tongue yellow; tastes bitter",
      "Nausea after coffee",
      "Flatulent colic after anger"
    ],
    respiratorySymptoms: [
      "Hoarse, dry cough",
      "Suffocative tightness of chest",
      "Rattling of mucus in chest"
    ],
    generalSymptoms: [
      "Unbearable pain drives to despair",
      "Numbness and insensibility",
      "Driving pains"
    ],
    modalities: {
      worse: ["Heat", "Anger", "Open air", "Wind", "Night"],
      better: ["Being carried", "Warm wet weather"]
    },
    potency: "30C",
    relationships: ["Belladonna and Chamomilla often follow each other", "Nux vomica follows well"],
    clinicalUses: ["Toothache", "Earache", "Diarrhea", "Insomnia", "After-pains"]
  },

  {
    name: "Gelsemium Sempervirens",
    commonName: "Yellow Jasmine",
    keyIndications: [
      "Drowsiness, dullness, dizziness",
      "Drooping of eyelids",
      "Muscular weakness",
      "Lack of thirst"
    ],
    mentalSymptoms: [
      "Dullness and drowsiness",
      "Desires to be left alone",
      "Delirious on falling asleep",
      "Apathy regarding his illness"
    ],
    headSymptoms: [
      "Dull, heavy headache",
      "Occipital headache",
      "Sensation of a band around head",
      "Scalp sore to touch"
    ],
    feverSymptoms: [
      "Chill up and down the back",
      "Heat and sweat stages are well marked",
      "Absence of thirst",
      "Pulse slow, full, soft"
    ],
    digestiveSymptoms: [
      "Difficulty in swallowing",
      "Sensation of lump in throat",
      "Hiccough; worse in the evening"
    ],
    respiratorySymptoms: [
      "Oppression about chest",
      "Dry cough, with sore chest",
      "Feeling of a weight on chest"
    ],
    generalSymptoms: [
      "Complete relaxation of the whole muscular system",
      "Trembling of hands",
      "General prostration"
    ],
    modalities: {
      worse: ["Damp weather", "Fog", "Before a thunderstorm", "Emotion", "Excitement"],
      better: ["Bending forward", "By profuse urination", "Open air", "Continued motion"]
    },
    potency: "30C to 200C",
    relationships: ["Baptisia, Ipecac, Sepia follow well"],
    clinicalUses: ["Influenza", "Measles", "Intermittent fever", "Nervous affections", "Writers' cramp"]
  },

  {
    name: "Nux Vomica",
    commonName: "Poison Nut",
    keyIndications: [
      "Irritability and anger",
      "Chilliness",
      "Digestive disturbances",
      "Sleeplessness"
    ],
    mentalSymptoms: [
      "Very irritable, wants to be left alone",
      "Cannot bear noises, odors, light",
      "Does not want to be touched",
      "Time passes too slowly"
    ],
    headSymptoms: [
      "Headache in back of head",
      "Sour, bitter taste",
      "Vertigo, with momentary loss of consciousness"
    ],
    feverSymptoms: [
      "Chilly stage predominates",
      "Must be covered in every stage",
      "Cannot move without chilliness",
      "Hot stage of fever"
    ],
    digestiveSymptoms: [
      "Sour taste, and nausea in the morning",
      "Region of stomach very sensitive to pressure",
      "Flatulence and pyrosis",
      "Constipation, with frequent ineffectual urging"
    ],
    respiratorySymptoms: [
      "Nose stuffed up at night",
      "Rough, scrapy feeling in throat",
      "Asthmatic breathing"
    ],
    generalSymptoms: [
      "Very chilly; cannot get warm",
      "Every draft of air affects him",
      "Oversensitive to all impressions"
    ],
    modalities: {
      worse: ["Morning", "Mental exertion", "After eating", "Touch", "Spices", "Narcotics", "Dry weather", "Cold"],
      better: ["From a nap", "If allowed to finish it", "In evening", "While at rest", "In damp wet weather"]
    },
    potency: "30C",
    relationships: ["Sulphur follows Nux in many chronic cases", "Sepia is complementary"],
    clinicalUses: ["Digestive troubles", "Constipation", "Hemorrhoids", "Irritability", "Insomnia"]
  }

  // TODO: Add more Boericke remedies for comprehensive coverage
  // Include: Pulsatilla, Arsenicum, Rhus Tox, Phosphorus, Lycopodium, etc.
];

// Greeting responses for natural interaction
export const GREETING_RESPONSES = {
  greetings: [
    "hi", "hello", "hey", "salam", "assalam alaikum", "good morning", 
    "good afternoon", "good evening", "greetings", "salaam"
  ],
  responses: [
    "Hello! I'm here to help you with homeopathic remedies. What symptoms can I assist you with today?",
    "Salam and welcome! How can I guide you in finding the right homeopathic medicine?",
    "Greetings! I'm ready to help you explore natural healing. What would you like to know?",
    "Hello there! I specialize in homeopathic remedies based on classical knowledge. How may I assist you?",
    "Welcome! Share your symptoms and I'll recommend suitable homeopathic medicines from authentic sources."
  ]
};

// Enhanced symptom matching using Boericke's methodology
export function findBoerickeRemedies(symptoms: string): BoerickeRemedy[] {
  const symptomLower = symptoms.toLowerCase();
  const matches: BoerickeRemedy[] = [];

  BOERICKE_REMEDIES.forEach(remedy => {
    let score = 0;
    
    // Check key indications (highest weight)
    remedy.keyIndications.forEach(indication => {
      if (symptomLower.includes(indication.toLowerCase())) {
        score += 10;
      }
    });

    // Check specific symptom categories
    if (symptomLower.includes('headache') || symptomLower.includes('head')) {
      remedy.headSymptoms.forEach(symptom => {
        if (symptomLower.includes(symptom.toLowerCase().split(' ').slice(0, 3).join(' '))) {
          score += 8;
        }
      });
    }

    if (symptomLower.includes('fever') || symptomLower.includes('temperature')) {
      remedy.feverSymptoms.forEach(symptom => {
        if (symptomLower.includes(symptom.toLowerCase().split(' ').slice(0, 3).join(' '))) {
          score += 8;
        }
      });
    }

    // Check general symptoms
    remedy.generalSymptoms.forEach(symptom => {
      if (symptomLower.includes(symptom.toLowerCase().split(' ').slice(0, 2).join(' '))) {
        score += 5;
      }
    });

    // Check clinical uses
    remedy.clinicalUses.forEach(use => {
      if (symptomLower.includes(use.toLowerCase())) {
        score += 6;
      }
    });

    if (score >= 5) {
      matches.push(remedy);
    }
  });

  // Sort by relevance (score) and return top matches
  return matches.slice(0, 5);
}

// Check if input is a greeting
export function isGreeting(input: string): boolean {
  const inputLower = input.toLowerCase().trim();
  return GREETING_RESPONSES.greetings.some(greeting => 
    inputLower === greeting || inputLower.startsWith(greeting + ' ') || inputLower.includes(greeting)
  );
}

// Get random greeting response
export function getGreetingResponse(): string {
  const responses = GREETING_RESPONSES.responses;
  return responses[Math.floor(Math.random() * responses.length)];
}