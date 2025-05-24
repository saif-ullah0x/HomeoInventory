import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, Book, Target, ArrowLeft, Search, Star, CheckCircle, X, Sparkles, Award, Clock } from "lucide-react";

interface AILearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HomeopathicRemedy {
  id: number;
  name: string;
  commonName: string;
  uses: string[];
  symptoms: string[];
  dosage: string;
  frequency: string;
  category: string;
  potency: string;
  keynotes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  remedyId: number;
}

// Comprehensive database of 50+ common homeopathic medicines
const HOMEOPATHIC_REMEDIES: HomeopathicRemedy[] = [
  {
    id: 1,
    name: "Arnica Montana",
    commonName: "Mountain Arnica",
    uses: ["Bruises", "Trauma", "Muscle soreness", "Post-surgical healing", "Shock"],
    symptoms: ["Physical trauma", "Bruising", "Muscle aches", "Soreness from overexertion"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Trauma & Injury",
    potency: "30C",
    keynotes: ["First remedy for any injury", "Refuses help saying they're fine", "Bed feels too hard"],
    difficulty: 'Beginner'
  },
  {
    id: 2,
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    uses: ["High fever", "Headaches", "Sore throat", "Inflammation", "Sudden onset conditions"],
    symptoms: ["Sudden high fever", "Red face", "Throbbing headache", "Hot and burning sensations"],
    dosage: "3-5 pellets",
    frequency: "Every 2-3 hours",
    category: "Fever & Inflammation",
    potency: "30C",
    keynotes: ["Sudden violent onset", "Red, hot, throbbing", "Worse from light and noise"],
    difficulty: 'Beginner'
  },
  {
    id: 3,
    name: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    uses: ["Joint stiffness", "Rheumatism", "Skin rashes", "Restlessness", "Sprains"],
    symptoms: ["Stiffness worse on first motion", "Restless legs", "Itchy skin eruptions"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Joint & Muscle",
    potency: "30C",
    keynotes: ["Better from motion after initial stiffness", "Restless", "Worse in damp weather"],
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    name: "Aconitum Napellus",
    commonName: "Monkshood",
    uses: ["Sudden fever", "Panic attacks", "Fear", "Shock", "Cold exposure"],
    symptoms: ["Sudden onset after cold wind", "Great fear and anxiety", "Restlessness"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Acute & Emergency",
    potency: "30C",
    keynotes: ["Sudden onset after fright or cold", "Great fear of death", "Worse around midnight"],
    difficulty: 'Beginner'
  },
  {
    id: 5,
    name: "Chamomilla",
    commonName: "German Chamomile",
    uses: ["Teething", "Colic", "Irritability", "Earache", "Sleeplessness"],
    symptoms: ["Extreme irritability", "One cheek red, one pale", "Wants to be carried"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Children & Irritability",
    potency: "30C",
    keynotes: ["Nothing pleases", "Angry and irritable", "Better from being carried"],
    difficulty: 'Beginner'
  },
  {
    id: 6,
    name: "Nux Vomica",
    commonName: "Poison Nut",
    uses: ["Digestive issues", "Hangover", "Constipation", "Irritability", "Overindulgence"],
    symptoms: ["Digestive complaints from rich food", "Irritable and impatient", "Chilly"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive",
    potency: "30C",
    keynotes: ["Type A personality", "Worse from stimulants", "Chilly and irritable"],
    difficulty: 'Intermediate'
  },
  {
    id: 7,
    name: "Pulsatilla",
    commonName: "Wind Flower",
    uses: ["Colds", "Ear infections", "Digestive upset", "Hormonal issues", "Changeable symptoms"],
    symptoms: ["Thick yellow discharge", "Worse in warm rooms", "Wants fresh air"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Hormonal",
    potency: "30C",
    keynotes: ["Mild, yielding disposition", "Worse in warm rooms", "Changeable symptoms"],
    difficulty: 'Intermediate'
  },
  {
    id: 8,
    name: "Apis Mellifica",
    commonName: "Honey Bee",
    uses: ["Bee stings", "Allergic reactions", "Swelling", "Burning pain", "Hives"],
    symptoms: ["Burning, stinging pains", "Swelling", "Better from cold applications"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Allergic Reactions",
    potency: "30C",
    keynotes: ["Burning, stinging pains", "Swelling", "Better from cold"],
    difficulty: 'Beginner'
  },
  {
    id: 9,
    name: "Bryonia Alba",
    commonName: "White Bryony",
    uses: ["Headaches", "Cough", "Joint pain", "Irritability", "Constipation"],
    symptoms: ["Worse from any motion", "Wants to be left alone", "Dry mucous membranes"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Joint",
    potency: "30C",
    keynotes: ["Worse from motion", "Wants to be still", "Very irritable when disturbed"],
    difficulty: 'Intermediate'
  },
  {
    id: 10,
    name: "Calcarea Carbonica",
    commonName: "Calcium Carbonate",
    uses: ["Bone health", "Slow development", "Fatigue", "Anxiety", "Digestive issues"],
    symptoms: ["Chilly and sweaty", "Slow to develop", "Head sweats during sleep"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Constitutional",
    potency: "200C",
    keynotes: ["Chilly, sweaty head", "Slow and cautious", "Craves eggs"],
    difficulty: 'Advanced'
  },
  {
    id: 11,
    name: "Gelsemium",
    commonName: "Yellow Jasmine",
    uses: ["Flu", "Anxiety", "Stage fright", "Headaches", "Weakness"],
    symptoms: ["Droopy eyelids", "Trembling", "Weakness", "Anticipatory anxiety"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Flu & Anxiety",
    potency: "30C",
    keynotes: ["Droopy and drowsy", "Trembling from weakness", "Worse from anticipation"],
    difficulty: 'Intermediate'
  },
  {
    id: 12,
    name: "Hepar Sulphuris",
    commonName: "Liver of Sulfur",
    uses: ["Infected wounds", "Abscesses", "Croup", "Sensitivity to cold", "Irritability"],
    symptoms: ["Oversensitive to pain and cold", "Splinter-like pains", "Irritable"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Infection & Irritability",
    potency: "30C",
    keynotes: ["Oversensitive to pain", "Chilly", "Wants warmth"],
    difficulty: 'Advanced'
  },
  {
    id: 13,
    name: "Hypericum",
    commonName: "St. John's Wort",
    uses: ["Nerve injuries", "Cuts", "Puncture wounds", "Shooting pains", "Dental pain"],
    symptoms: ["Shooting pains along nerves", "Injuries to nerve-rich areas", "Puncture wounds"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Nerve Injuries",
    potency: "30C",
    keynotes: ["Injuries to nerve-rich areas", "Shooting pains", "Puncture wounds"],
    difficulty: 'Beginner'
  },
  {
    id: 14,
    name: "Ignatia",
    commonName: "St. Ignatius Bean",
    uses: ["Grief", "Emotional upset", "Hysteria", "Spasms", "Contradictory symptoms"],
    symptoms: ["Sighing", "Mood swings", "Lump in throat", "Contradictory symptoms"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Emotional",
    potency: "30C",
    keynotes: ["Grief and emotional upset", "Sighing", "Contradictory symptoms"],
    difficulty: 'Intermediate'
  },
  {
    id: 15,
    name: "Ledum",
    commonName: "Marsh Tea",
    uses: ["Puncture wounds", "Animal bites", "Black eye", "Cold injuries", "Tetanus prevention"],
    symptoms: ["Puncture wounds", "Better from cold applications", "Shooting pains upward"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Puncture Wounds",
    potency: "30C",
    keynotes: ["Puncture wounds", "Better from cold", "Prevents tetanus"],
    difficulty: 'Beginner'
  },
  // Adding 35 more remedies to reach 50+
  {
    id: 16,
    name: "Mercurius",
    commonName: "Mercury",
    uses: ["Sore throat", "Mouth ulcers", "Gum problems", "Night sweats", "Tremors"],
    symptoms: ["Metallic taste", "Excessive salivation", "Worse at night", "Trembling"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Mouth & Throat",
    potency: "30C",
    keynotes: ["Metallic taste", "Worse at night", "Excessive salivation"],
    difficulty: 'Advanced'
  },
  {
    id: 17,
    name: "Natrum Muriaticum",
    commonName: "Salt",
    uses: ["Grief", "Headaches", "Cold sores", "Dry skin", "Depression"],
    symptoms: ["Craves salt", "Worse from consolation", "Dry mucous membranes"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Constitutional",
    potency: "200C",
    keynotes: ["Craves salt", "Worse from consolation", "Holds grudges"],
    difficulty: 'Advanced'
  },
  {
    id: 18,
    name: "Phosphorus",
    commonName: "Phosphorus",
    uses: ["Bleeding", "Pneumonia", "Anxiety", "Burning pains", "Weakness"],
    symptoms: ["Easy bleeding", "Burning pains", "Desires cold drinks", "Sympathetic nature"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Bleeding & Respiratory",
    potency: "30C",
    keynotes: ["Easy bleeding", "Sympathetic", "Desires cold drinks"],
    difficulty: 'Advanced'
  },
  {
    id: 19,
    name: "Sepia",
    commonName: "Cuttlefish Ink",
    uses: ["Hormonal issues", "Depression", "Fatigue", "Prolapse", "Indifference"],
    symptoms: ["Indifferent to family", "Worse before menses", "Dragging sensation"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Hormonal & Emotional",
    potency: "200C",
    keynotes: ["Indifferent to loved ones", "Better from exercise", "Hormonal issues"],
    difficulty: 'Advanced'
  },
  {
    id: 20,
    name: "Sulphur",
    commonName: "Sulfur",
    uses: ["Skin conditions", "Itching", "Burning", "Chronic diseases", "Relapse prevention"],
    symptoms: ["Burning sensations", "Worse from heat", "Itchy skin", "Offensive odors"],
    dosage: "3-5 pellets",
    frequency: "Once weekly",
    category: "Skin & Constitutional",
    potency: "200C",
    keynotes: ["Burning sensations", "Worse from heat", "Philosophical mind"],
    difficulty: 'Advanced'
  },
  // Continue adding more remedies...
  {
    id: 21,
    name: "Arsenicum Album",
    commonName: "White Arsenic",
    uses: ["Food poisoning", "Anxiety", "Asthma", "Burning pains", "Restlessness"],
    symptoms: ["Burning pains relieved by heat", "Restless anxiety", "Worse after midnight"],
    dosage: "3-5 pellets",
    frequency: "Every 2 hours",
    category: "Digestive & Anxiety",
    potency: "30C",
    keynotes: ["Restless anxiety", "Burning relieved by heat", "Worse 1-3 AM"],
    difficulty: 'Intermediate'
  },
  {
    id: 22,
    name: "Carbo Vegetabilis",
    commonName: "Vegetable Charcoal",
    uses: ["Digestive gas", "Weakness", "Poor circulation", "Fainting", "Bloating"],
    symptoms: ["Excessive gas", "Wants to be fanned", "Cold extremities", "Bloated abdomen"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive & Circulation",
    potency: "30C",
    keynotes: ["Wants to be fanned", "Excessive gas", "Never well since..."],
    difficulty: 'Intermediate'
  },
  {
    id: 23,
    name: "Drosera",
    commonName: "Sundew",
    uses: ["Whooping cough", "Spasmodic cough", "Laryngitis", "Growing pains", "Restlessness"],
    symptoms: ["Barking cough", "Worse lying down", "Cough in spasms", "Hoarse voice"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Respiratory",
    potency: "30C",
    keynotes: ["Spasmodic barking cough", "Worse lying down", "Whooping cough"],
    difficulty: 'Intermediate'
  },
  {
    id: 24,
    name: "Euphrasia",
    commonName: "Eyebright",
    uses: ["Eye infections", "Allergic conjunctivitis", "Hay fever", "Watery eyes", "Eye strain"],
    symptoms: ["Burning tears", "Red inflamed eyes", "Profuse watery discharge"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Eye Conditions",
    potency: "30C",
    keynotes: ["Burning tears", "Eye symptoms predominate", "Hay fever"],
    difficulty: 'Beginner'
  },
  {
    id: 25,
    name: "Ferrum Phosphoricum",
    commonName: "Iron Phosphate",
    uses: ["First stage fever", "Anemia", "Nosebleeds", "Weakness", "Inflammation"],
    symptoms: ["Low grade fever", "Easy bleeding", "Pale but flushes easily"],
    dosage: "3-5 pellets",
    frequency: "Every 2 hours",
    category: "Fever & Anemia",
    potency: "30C",
    keynotes: ["First stage of inflammation", "Easy bleeding", "Better from cold"],
    difficulty: 'Beginner'
  },
  {
    id: 26,
    name: "Kali Phosphoricum",
    commonName: "Potassium Phosphate",
    uses: ["Mental fatigue", "Depression", "Nervous exhaustion", "Memory problems", "Anxiety"],
    symptoms: ["Mental burnout", "Yellow tongue coating", "Nervous headaches", "Wants solitude"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Mental & Nervous",
    potency: "30C",
    keynotes: ["Mental exhaustion", "Yellow discharges", "Worse from mental exertion"],
    difficulty: 'Intermediate'
  },
  {
    id: 27,
    name: "Lycopodium",
    commonName: "Club Moss",
    uses: ["Digestive issues", "Liver problems", "Anxiety", "Hair loss", "Bloating"],
    symptoms: ["Right-sided symptoms", "Worse 4-8 PM", "Bloating after eating", "Lacks confidence"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Digestive & Constitutional",
    potency: "200C",
    keynotes: ["Right-sided symptoms", "Worse 4-8 PM", "Cowardly but bossy at home"],
    difficulty: 'Advanced'
  },
  {
    id: 28,
    name: "Magnesia Phosphorica",
    commonName: "Magnesium Phosphate",
    uses: ["Muscle cramps", "Colic", "Neuralgic pains", "Menstrual cramps", "Writer's cramp"],
    symptoms: ["Cramping pains", "Better from heat", "Better from pressure", "Shooting pains"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Muscle & Nerve",
    potency: "30C",
    keynotes: ["Cramping pains better from heat", "Shooting neuralgic pains", "Writer's cramp"],
    difficulty: 'Beginner'
  },
  {
    id: 29,
    name: "Natrum Phosphoricum",
    commonName: "Sodium Phosphate",
    uses: ["Acidity", "Heartburn", "Sour stomach", "Joint stiffness", "Worms in children"],
    symptoms: ["Sour taste", "Yellow creamy coating on tongue", "Craves fried foods", "Joint crackling"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive",
    potency: "30C",
    keynotes: ["Sour symptoms", "Yellow discharges", "Craves fats"],
    difficulty: 'Intermediate'
  },
  {
    id: 30,
    name: "Platina",
    commonName: "Platinum",
    uses: ["Hormonal issues", "Ovarian problems", "Pride", "Sexual dysfunction", "Numbness"],
    symptoms: ["Ovarian pain", "Feels superior to others", "Numb sensations", "Spasmodic pains"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Hormonal & Mental",
    potency: "200C",
    keynotes: ["Feels superior", "Ovarian symptoms", "Numbness"],
    difficulty: 'Advanced'
  },
  {
    id: 31,
    name: "Ruta Graveolens",
    commonName: "Rue",
    uses: ["Tendon injuries", "Eye strain", "Bone injuries", "Bruised feeling", "Restlessness"],
    symptoms: ["Sore bruised bones", "Eye strain from reading", "Restless dissatisfied feeling"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Injury & Strain",
    potency: "30C",
    keynotes: ["Bone and tendon injuries", "Eye strain", "Bruised feeling in bones"],
    difficulty: 'Beginner'
  },
  {
    id: 32,
    name: "Silicea",
    commonName: "Silica",
    uses: ["Weak nails", "Hair problems", "Chronic infections", "Lack of confidence", "Slow healing"],
    symptoms: ["Chilly", "Sweaty feet", "Weak nails and hair", "Yields easily", "Foreign body sensation"],
    dosage: "3-5 pellets",
    frequency: "Once weekly",
    category: "Constitutional",
    potency: "200C",
    keynotes: ["Chilly and yielding", "Helps expel foreign bodies", "Weak hair and nails"],
    difficulty: 'Advanced'
  },
  {
    id: 33,
    name: "Staphysagria",
    commonName: "Stavesacre",
    uses: ["Suppressed anger", "Surgical wounds", "Cystitis", "Styes", "Indignation"],
    symptoms: ["Suppressed emotions", "Anger from being hurt", "Recurring styes", "Honeymoon cystitis"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Emotional & Surgical",
    potency: "30C",
    keynotes: ["Suppressed indignation", "Effects of suppressed anger", "Post-surgical healing"],
    difficulty: 'Intermediate'
  },
  {
    id: 34,
    name: "Symphytum",
    commonName: "Comfrey",
    uses: ["Bone fractures", "Eye injuries", "Phantom limb pain", "Non-union fractures", "Bone healing"],
    symptoms: ["Bone injuries", "Eye trauma", "Slow healing bones", "Phantom pain"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Bone & Eye Injury",
    potency: "30C",
    keynotes: ["Bone fractures", "Eye injuries", "Phantom limb pain"],
    difficulty: 'Beginner'
  },
  {
    id: 35,
    name: "Thuja Occidentalis",
    commonName: "Arbor Vitae",
    uses: ["Warts", "Vaccination effects", "Chronic conditions", "Oily skin", "Fixed ideas"],
    symptoms: ["Warty growths", "Oily perspiration", "Fixed ideas", "Feels fragile"],
    dosage: "3-5 pellets",
    frequency: "Once weekly",
    category: "Skin & Constitutional",
    potency: "200C",
    keynotes: ["Warts and growths", "Fixed ideas", "Feels breakable"],
    difficulty: 'Advanced'
  },
  {
    id: 36,
    name: "Veratrum Album",
    commonName: "White Hellebore",
    uses: ["Collapse", "Severe diarrhea", "Cold sweats", "Cholera", "Extreme weakness"],
    symptoms: ["Cold sweats", "Extreme weakness", "Violent purging", "Craves cold water"],
    dosage: "3-5 pellets",
    frequency: "Every 15 minutes",
    category: "Acute Collapse",
    potency: "30C",
    keynotes: ["Cold sweats with weakness", "Violent symptoms", "Craves ice water"],
    difficulty: 'Advanced'
  },
  {
    id: 37,
    name: "Zincum Metallicum",
    commonName: "Zinc",
    uses: ["Restless legs", "Nervous exhaustion", "Brain fatigue", "Twitching", "Varicose veins"],
    symptoms: ["Restless feet", "Mental fatigue", "Twitching muscles", "Worse from wine"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Nervous System",
    potency: "30C",
    keynotes: ["Restless legs and feet", "Mental exhaustion", "Twitching"],
    difficulty: 'Intermediate'
  },
  {
    id: 38,
    name: "Allium Cepa",
    commonName: "Red Onion",
    uses: ["Hay fever", "Colds", "Watery eyes", "Burning nasal discharge", "Spring allergies"],
    symptoms: ["Watery eyes", "Burning nasal discharge", "Better in open air", "Worse indoors"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Allergies & Colds",
    potency: "30C",
    keynotes: ["Burning nasal discharge", "Bland eye discharge", "Better in open air"],
    difficulty: 'Beginner'
  },
  {
    id: 39,
    name: "Antimonium Crudum",
    commonName: "Black Antimony",
    uses: ["Digestive upset", "Thick white tongue", "Irritability", "Warts", "Overeating"],
    symptoms: ["Thick white tongue coating", "Irritable when looked at", "Worse from heat"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive & Skin",
    potency: "30C",
    keynotes: ["Thick white tongue", "Don't look at me", "Worse from bathing"],
    difficulty: 'Intermediate'
  },
  {
    id: 40,
    name: "Argentum Nitricum",
    commonName: "Silver Nitrate",
    uses: ["Anxiety", "Stage fright", "Diarrhea from anticipation", "Eye problems", "Hurried feeling"],
    symptoms: ["Anticipatory anxiety", "Hurried sensation", "Craves sweets but they disagree"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Anxiety & Anticipation",
    potency: "30C",
    keynotes: ["Anticipatory anxiety", "Hurried and impulsive", "Craves but can't digest sweets"],
    difficulty: 'Intermediate'
  },
  {
    id: 41,
    name: "Baryta Carbonica",
    commonName: "Barium Carbonate",
    uses: ["Shyness", "Delayed development", "Enlarged glands", "Memory problems", "Childishness in adults"],
    symptoms: ["Bashful and timid", "Slow development", "Enlarged tonsils", "Poor memory"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Development & Glands",
    potency: "200C",
    keynotes: ["Bashful and timid", "Delayed development", "Enlarged glands"],
    difficulty: 'Advanced'
  },
  {
    id: 42,
    name: "Cannabis Indica",
    commonName: "Indian Hemp",
    uses: ["Anxiety", "Paranoia", "Time distortion", "Urinary problems", "Delirium"],
    symptoms: ["Time seems long", "Exaggerated symptoms", "Paranoid thoughts", "Floating sensation"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Mental & Urinary",
    potency: "30C",
    keynotes: ["Time distortion", "Exaggerated perceptions", "Paranoid delusions"],
    difficulty: 'Advanced'
  },
  {
    id: 43,
    name: "Causticum",
    commonName: "Potassium Hydrate",
    uses: ["Burns", "Paralysis", "Incontinence", "Warts", "Hoarseness"],
    symptoms: ["Gradual paralysis", "Stress incontinence", "Hoarse voice", "Sympathetic nature"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Paralysis & Burns",
    potency: "30C",
    keynotes: ["Gradual paralysis", "Sympathetic to others' suffering", "Burns and scalds"],
    difficulty: 'Advanced'
  },
  {
    id: 44,
    name: "Cocculus",
    commonName: "Indian Cockle",
    uses: ["Motion sickness", "Vertigo", "Exhaustion from caregiving", "Insomnia", "Nausea"],
    symptoms: ["Nausea from motion", "Exhausted from caring for others", "Hollow empty feeling"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Motion & Exhaustion",
    potency: "30C",
    keynotes: ["Motion sickness", "Exhaustion from caregiving", "Hollow feeling"],
    difficulty: 'Beginner'
  },
  {
    id: 45,
    name: "Coffea Cruda",
    commonName: "Coffee",
    uses: ["Insomnia", "Hypersensitivity", "Overexcitement", "Toothache", "Joy or grief"],
    symptoms: ["Wide awake from mental activity", "Oversensitive to pain", "Rapid thought flow"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Stimulation & Sleep",
    potency: "30C",
    keynotes: ["Sleepless from mental activity", "Hypersensitive", "Rapid thoughts"],
    difficulty: 'Beginner'
  },
  {
    id: 46,
    name: "Colocynthis",
    commonName: "Bitter Cucumber",
    uses: ["Colic", "Cramping pains", "Sciatica", "Anger effects", "Neuralgic pains"],
    symptoms: ["Cramping doubled-up pains", "Better from pressure", "Anger brings on symptoms"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Colic & Neuralgia",
    potency: "30C",
    keynotes: ["Cramping pains better from pressure", "Doubled up position", "Anger causes illness"],
    difficulty: 'Intermediate'
  },
  {
    id: 47,
    name: "Cuprum Metallicum",
    commonName: "Copper",
    uses: ["Muscle cramps", "Spasms", "Colic", "Convulsions", "Whooping cough"],
    symptoms: ["Violent cramping", "Spasmodic symptoms", "Blue lips and nails", "Metallic taste"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Spasms & Cramps",
    potency: "30C",
    keynotes: ["Violent spasms and cramps", "Blue discoloration", "Metallic taste"],
    difficulty: 'Advanced'
  },
  {
    id: 48,
    name: "Dulcamara",
    commonName: "Bittersweet",
    uses: ["Cold damp weather effects", "Colds", "Diarrhea", "Skin conditions", "Rheumatism"],
    symptoms: ["Worse from cold damp weather", "Catches cold easily", "Better from warmth"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Weather Effects",
    potency: "30C",
    keynotes: ["Worse from cold damp weather", "Catches cold from getting wet", "Better warmth"],
    difficulty: 'Intermediate'
  },
  {
    id: 49,
    name: "Graphites",
    commonName: "Graphite",
    uses: ["Skin conditions", "Eczema", "Constipation", "Obesity", "Nail problems"],
    symptoms: ["Thick honey-like discharges", "Cracked skin", "Chilly and obese", "Irresolute"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Skin & Constitutional",
    potency: "200C",
    keynotes: ["Honey-like discharges", "Cracked skin especially fingers", "Chilly and obese"],
    difficulty: 'Advanced'
  },
  {
    id: 50,
    name: "Hamamelis",
    commonName: "Witch Hazel",
    uses: ["Varicose veins", "Hemorrhoids", "Bleeding", "Venous congestion", "Nosebleeds"],
    symptoms: ["Venous congestion", "Passive bleeding", "Sore bruised feeling", "Heavy legs"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Venous & Bleeding",
    potency: "30C",
    keynotes: ["Venous problems", "Passive bleeding", "Sore bruised veins"],
    difficulty: 'Beginner'
  },
  {
    id: 51,
    name: "Ipecacuanha",
    commonName: "Ipecac Root",
    uses: ["Nausea", "Vomiting", "Asthma", "Bleeding", "Morning sickness"],
    symptoms: ["Persistent nausea", "Clean tongue with nausea", "Difficult breathing", "Bright red bleeding"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Nausea & Respiratory",
    potency: "30C",
    keynotes: ["Persistent nausea with clean tongue", "Bright red bleeding", "Difficult breathing"],
    difficulty: 'Beginner'
  },
  {
    id: 52,
    name: "Kali Bichromicum",
    commonName: "Potassium Dichromate",
    uses: ["Sinusitis", "Thick mucus", "Ulcers", "Joint pains", "Catarrh"],
    symptoms: ["Thick stringy mucus", "Pressure at root of nose", "Wandering joint pains"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Mucus & Sinuses",
    potency: "30C",
    keynotes: ["Thick stringy discharges", "Pressure at root of nose", "Symptoms in small spots"],
    difficulty: 'Intermediate'
  }
];

// Generate quiz questions based on the remedies
const generateQuizQuestions = (remedies: HomeopathicRemedy[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  remedies.forEach((remedy, index) => {
    // Question about main use
    questions.push({
      id: index * 3 + 1,
      question: `What is ${remedy.name} primarily used for?`,
      options: [
        remedy.uses[0],
        remedies[(index + 1) % remedies.length].uses[0],
        remedies[(index + 2) % remedies.length].uses[0],
        remedies[(index + 3) % remedies.length].uses[0]
      ],
      correctAnswer: 0,
      explanation: `${remedy.name} is primarily used for ${remedy.uses[0]}. ${remedy.keynotes[0]}.`,
      remedyId: remedy.id
    });
    
    // Question about keynote
    if (remedy.keynotes.length > 0) {
      questions.push({
        id: index * 3 + 2,
        question: `Which keynote symptom is characteristic of ${remedy.name}?`,
        options: [
          remedy.keynotes[0],
          remedies[(index + 1) % remedies.length].keynotes[0] || "General weakness",
          remedies[(index + 2) % remedies.length].keynotes[0] || "Restlessness",
          remedies[(index + 3) % remedies.length].keynotes[0] || "Irritability"
        ],
        correctAnswer: 0,
        explanation: `${remedy.keynotes[0]} is a key characteristic of ${remedy.name}.`,
        remedyId: remedy.id
      });
    }
  });
  
  return questions.slice(0, 100); // Limit to 100 questions
};

export default function AIEnhancedLearningAssistant({ isOpen, onClose }: AILearningAssistantProps) {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRemedies, setFilteredRemedies] = useState<HomeopathicRemedy[]>(HOMEOPATHIC_REMEDIES);
  const [selectedRemedy, setSelectedRemedy] = useState<HomeopathicRemedy | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = HOMEOPATHIC_REMEDIES.filter(remedy =>
        remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRemedies(filtered);
    } else {
      setFilteredRemedies(HOMEOPATHIC_REMEDIES);
    }
  }, [searchTerm]);

  const startQuiz = () => {
    const questions = generateQuizQuestions(filteredRemedies.slice(0, 10));
    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Glassy Header with Purple Gradient */}
        <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 animate-pulse"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg border border-white/30 animate-bounce">
                <Brain className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
                  AI-Enhanced Remedy Learning Assistant
                </h1>
                <p className="text-purple-100 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Master homeopathic remedies with interactive learning and quizzes
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Content Area with Scroll */}
        <ScrollArea className="h-[calc(90vh-120px)] bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
          <div className="p-6">
            <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="learn" className="flex items-center gap-2 font-medium">
                  <Book className="h-4 w-4" />
                  Learn Remedies
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2 font-medium">
                  <Target className="h-4 w-4" />
                  Test Knowledge
                </TabsTrigger>
              </TabsList>

              {/* Search Bar */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  🔍 Search remedies, conditions, or symptoms:
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., Arnica, headache, fever, bruises..."
                      className="pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {activeTab === "quiz" && (
                    <Button 
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="learn" className="mt-0">
                {selectedRemedy ? (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                            {selectedRemedy.name}
                          </CardTitle>
                          <p className="text-purple-600 dark:text-purple-300 italic">
                            {selectedRemedy.commonName}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={selectedRemedy.difficulty === 'Beginner' ? 'default' : selectedRemedy.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                            {selectedRemedy.difficulty}
                          </Badge>
                          <Badge variant="outline">{selectedRemedy.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <Button
                        onClick={() => setSelectedRemedy(null)}
                        variant="outline"
                        size="sm"
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                      </Button>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Primary Uses
                          </h4>
                          <ul className="space-y-2">
                            {selectedRemedy.uses.map((use, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {use}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-3">Key Symptoms</h4>
                          <ul className="space-y-2">
                            {selectedRemedy.symptoms.map((symptom, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div>
                          <h5 className="font-semibold mb-2">Dosage</h5>
                          <p className="text-sm">{selectedRemedy.dosage}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Frequency</h5>
                          <p className="text-sm">{selectedRemedy.frequency}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Potency</h5>
                          <p className="text-sm">{selectedRemedy.potency}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3">Key Notes</h4>
                        <div className="space-y-2">
                          {selectedRemedy.keynotes.map((note, index) => (
                            <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-400">
                              <p className="text-sm">{note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRemedies.map((remedy) => (
                      <Card 
                        key={remedy.id} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 hover:border-purple-400"
                        onClick={() => setSelectedRemedy(remedy)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-purple-800 dark:text-purple-200">
                                {remedy.name}
                              </CardTitle>
                              <p className="text-sm text-purple-600 dark:text-purple-300 italic">
                                {remedy.commonName}
                              </p>
                            </div>
                            <Badge variant={remedy.difficulty === 'Beginner' ? 'default' : remedy.difficulty === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                              {remedy.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline" className="mb-3">
                            {remedy.category}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Primary use: {remedy.uses[0]}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Click to learn more →
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                {!quizStarted ? (
                  <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <Award className="h-6 w-6 text-yellow-500" />
                        Test Your Knowledge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg">
                        Ready to test what you've learned about homeopathic remedies?
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {filteredRemedies.length} remedies available for quiz questions
                      </p>
                      <Button 
                        onClick={startQuiz}
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
                      >
                        <Target className="h-5 w-5 mr-2" />
                        Start Quiz Now
                      </Button>
                    </CardContent>
                  </Card>
                ) : quizCompleted ? (
                  <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <Award className="h-6 w-6 text-yellow-500" />
                        Quiz Complete!
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-4xl font-bold text-purple-600">
                        {score}/{quizQuestions.length}
                      </div>
                      <p className="text-lg">
                        You scored {Math.round((score/quizQuestions.length) * 100)}%
                      </p>
                      <Button 
                        onClick={startQuiz}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      >
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
                        <Badge variant="outline">Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}</Badge>
                      </div>
                      <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {quizQuestions[currentQuestion]?.question}
                      </h3>
                      
                      <div className="space-y-2">
                        {quizQuestions[currentQuestion]?.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              showAnswer
                                ? index === quizQuestions[currentQuestion].correctAnswer
                                  ? "default"
                                  : index === selectedAnswer
                                  ? "destructive"
                                  : "outline"
                                : selectedAnswer === index
                                ? "secondary"
                                : "outline"
                            }
                            className="w-full text-left justify-start p-4 h-auto"
                            onClick={() => !showAnswer && handleAnswerSelect(index)}
                            disabled={showAnswer}
                          >
                            <div className="flex items-center gap-2">
                              {showAnswer && index === quizQuestions[currentQuestion].correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {showAnswer && index === selectedAnswer && index !== quizQuestions[currentQuestion].correctAnswer && (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                              <span>{option}</span>
                            </div>
                          </Button>
                        ))}
                      </div>

                      {showAnswer && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                          <p className="font-semibold mb-2">Explanation:</p>
                          <p className="text-sm">{quizQuestions[currentQuestion].explanation}</p>
                        </div>
                      )}

                      {showAnswer && (
                        <div className="flex justify-end">
                          <Button onClick={nextQuestion}>
                            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}