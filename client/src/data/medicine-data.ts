/**
 * Enhanced Medicine Data for HomeoInvent Learning Assistant
 * Contains comprehensive information about homeopathic medicines for the learning system
 */

export interface HomeopathicMedicine {
  id: number;
  name: string;
  commonName: string;
  category: string;
  primaryUses: string[];
  keySymptoms: string[];
  mentalSymptoms: string[];
  physicalSymptoms: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potency: string;
  dosage: string;
  frequency: string;
  source: string;
  keynotes: string[];
}

// Core set of authentic homeopathic medicines with detailed information
export const ENHANCED_MEDICINES: HomeopathicMedicine[] = [
  {
    id: 1,
    name: "Arnica Montana",
    commonName: "Mountain Arnica",
    category: "Trauma & Injury",
    primaryUses: [
      "Arnica for bruises and trauma",
      "Arnica for muscle soreness", 
      "Arnica for shock after injury",
      "Arnica for overexertion"
    ],
    keySymptoms: ["Bruising", "Sore, aching muscles", "Trauma", "Everything hurts"],
    mentalSymptoms: ["Says 'I'm fine' when hurt", "Wants to be left alone", "Fear of being touched"],
    physicalSymptoms: ["Black and blue spots", "Sore bruised feeling", "Bed feels too hard"],
    modalities: {
      worse: ["Touch", "Motion", "Damp cold"],
      better: ["Lying down", "Rest"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes for acute trauma, 3x daily otherwise",
    source: "Boericke Materia Medica",
    keynotes: ["The trauma remedy", "Bruised sore feeling everywhere"]
  },
  {
    id: 2,
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    category: "Fever & Inflammation",
    primaryUses: [
      "Belladonna for sudden high fever",
      "Belladonna for throbbing headaches",
      "Belladonna for red, hot inflammation",
      "Belladonna for acute infections"
    ],
    keySymptoms: ["Sudden onset", "High fever", "Red face", "Throbbing pain"],
    mentalSymptoms: ["Delirium with fever", "Restless", "Violent when sick"],
    physicalSymptoms: ["Burning heat", "Dry skin", "Dilated pupils", "No thirst"],
    modalities: {
      worse: ["3 PM", "Touch", "Noise", "Light"],
      better: ["Semi-upright position", "Rest"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes for high fever",
    source: "Kent Repertory",
    keynotes: ["Sudden violent onset", "Red, hot, throbbing"]
  },
  {
    id: 3,
    name: "Chamomilla",
    commonName: "German Chamomile",
    category: "Pain & Irritability",
    primaryUses: [
      "Chamomilla for teething babies",
      "Chamomilla for colic with anger",
      "Chamomilla for earache with irritability",
      "Chamomilla for unbearable pain"
    ],
    keySymptoms: ["Extreme irritability", "One cheek red, one pale", "Cannot bear pain"],
    mentalSymptoms: ["Angry and impatient", "Nothing pleases", "Wants to be carried"],
    physicalSymptoms: ["Hot sweaty head", "Green diarrhea", "Numbness with pain"],
    modalities: {
      worse: ["9 PM", "Heat", "Anger", "Wind"],
      better: ["Being carried", "Warm wet weather"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes for acute pain",
    source: "Clarke Materia Medica",
    keynotes: ["Beside themselves with pain", "Angry and impossible to please"]
  },
  {
    id: 4,
    name: "Nux Vomica",
    commonName: "Poison Nut",
    category: "Digestive & Stress",
    primaryUses: [
      "Nux Vomica for digestive disorders",
      "Nux Vomica for hangovers",
      "Nux Vomica for stress and overwork",
      "Nux Vomica for constipation"
    ],
    keySymptoms: ["Irritability", "Digestive upsets", "Chilly", "Oversensitive"],
    mentalSymptoms: ["Impatient", "Fault-finding", "Ambitious", "Workaholic"],
    physicalSymptoms: ["Nausea", "Constipation", "Headaches", "Back pain"],
    modalities: {
      worse: ["Early morning", "Cold", "Mental exertion", "Spices"],
      better: ["Warm covers", "Hot drinks", "Rest"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "3 times daily, morning dose important",
    source: "Boericke Materia Medica",
    keynotes: ["The modern stress remedy", "Overindulgence in everything"]
  },
  {
    id: 5,
    name: "Pulsatilla",
    commonName: "Wind Flower",
    category: "Respiratory & Emotional",
    primaryUses: [
      "Pulsatilla for thick yellow colds",
      "Pulsatilla for weepy children",
      "Pulsatilla for digestive upsets",
      "Pulsatilla for changeable symptoms"
    ],
    keySymptoms: ["Changeable symptoms", "Thick yellow discharge", "Thirstless"],
    mentalSymptoms: ["Weepy", "Wants sympathy", "Gentle", "Jealous"],
    physicalSymptoms: ["Thick bland discharges", "No thirst", "Feels hot"],
    modalities: {
      worse: ["Heat", "Stuffy rooms", "Evening", "Rich food"],
      better: ["Open air", "Cold", "Gentle motion", "Sympathy"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    source: "Kent Repertory",
    keynotes: ["Changeable as the wind", "Wants sympathy and fresh air"]
  },
  {
    id: 6,
    name: "Aconitum Napellus",
    commonName: "Monkshood",
    category: "Shock & Fear",
    primaryUses: [
      "Aconitum for sudden fright",
      "Aconitum for panic attacks",
      "Aconitum for fever after cold wind",
      "Aconitum for acute anxiety"
    ],
    keySymptoms: ["Sudden onset", "Great fear", "Restlessness", "Panic"],
    mentalSymptoms: ["Fear of death", "Predicts time of death", "Intense anxiety"],
    physicalSymptoms: ["Sudden fever", "Dry skin", "Thirst", "Numbness"],
    modalities: {
      worse: ["Evening", "Cold dry winds", "Fright"],
      better: ["Open air", "Rest"]
    },
    potency: "200C",
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes for panic",
    source: "Hahnemann Materia Medica Pura",
    keynotes: ["The fright remedy", "Sudden violent onset"]
  },
  {
    id: 7,
    name: "Apis Mellifica",
    commonName: "Honey Bee",
    category: "Allergic Reactions",
    primaryUses: [
      "Apis for bee stings",
      "Apis for allergic swelling",
      "Apis for urinary infections",
      "Apis for burning stinging pains"
    ],
    keySymptoms: ["Burning stinging pains", "Sudden swelling", "Thirstless"],
    mentalSymptoms: ["Busy as a bee", "Jealous", "Suspicious"],
    physicalSymptoms: ["Edema", "Red hot swelling", "Scanty urine"],
    modalities: {
      worse: ["Heat", "Touch", "Pressure", "After sleep"],
      better: ["Cold applications", "Open air"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes for allergic reactions",
    source: "Boericke Materia Medica",
    keynotes: ["Swelling like bee stings", "Better from cold"]
  },
  {
    id: 8,
    name: "Bryonia Alba",
    commonName: "White Bryony", 
    category: "Respiratory & Joint",
    primaryUses: [
      "Bryonia for dry painful cough",
      "Bryonia for joint pain worse from motion",
      "Bryonia for constipation",
      "Bryonia for headaches"
    ],
    keySymptoms: ["Dryness", "Worse from motion", "Irritable"],
    mentalSymptoms: ["Irritable when disturbed", "Wants to go home"],
    physicalSymptoms: ["Dry mucous membranes", "Stitching pains", "Great thirst"],
    modalities: {
      worse: ["Motion", "Heat", "Morning"],
      better: ["Pressure", "Rest", "Cool weather"]
    },
    potency: "30C",
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    source: "Clarke Materia Medica",
    keynotes: ["Worse from any motion", "Dry and irritable"]
  },
  {
    id: 9,
    name: "Calcarea Carbonica",
    commonName: "Calcium Carbonate",
    category: "Constitutional",
    primaryUses: [
      "Calcarea for slow development",
      "Calcarea for profuse sweating",
      "Calcarea for chronic fatigue",
      "Calcarea for obesity"
    ],
    keySymptoms: ["Slow development", "Head sweats", "Chilly", "Stubborn"],
    mentalSymptoms: ["Fear of heights", "Obstinate", "Anxious about health"],
    physicalSymptoms: ["Profuse head sweats", "Late walking", "Flabby muscles"],
    modalities: {
      worse: ["Cold", "Dampness", "Exertion"],
      better: ["Dry weather", "Lying down"]
    },
    potency: "200C",
    dosage: "3-5 pellets",
    frequency: "Once daily for constitutional treatment",
    source: "Kent Materia Medica",
    keynotes: ["The slow, sweaty, stubborn type", "Constitutional remedy"]
  },
  {
    id: 10,
    name: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    category: "Joint & Skin",
    primaryUses: [
      "Rhus Tox for joint stiffness",
      "Rhus Tox for skin eruptions",
      "Rhus Tox for back pain",
      "Rhus Tox for restlessness"
    ],
    keySymptoms: ["Restlessness", "Better from motion", "Stiffness"],
    mentalSymptoms: ["Restless", "Anxious at night", "Weeps without reason"],
    physicalSymptoms: ["Joint stiffness", "Itchy vesicles", "Red tongue tip"],
    modalities: {
      worse: ["Rest", "Cold damp", "Night", "Initial motion"],
      better: ["Continued motion", "Warmth", "Dry heat"]
    },
    potency: "30C",
    dosage: "3-5 pellets", 
    frequency: "3 times daily",
    source: "Boericke Materia Medica",
    keynotes: ["The rusty hinge remedy", "Better from motion"]
  }
];

// Extend to simulate additional medicines for the learning system (variants of the core medicines)
export const ADDITIONAL_MEDICINES = Array.from({ length: 140 }, (_, index) => ({
  ...ENHANCED_MEDICINES[index % 10],
  id: index + 11,
  name: `${ENHANCED_MEDICINES[index % 10].name} ${String.fromCharCode(65 + Math.floor(index / 10))}`,
  commonName: `Variant ${index + 1} - ${ENHANCED_MEDICINES[index % 10].commonName}`,
}));