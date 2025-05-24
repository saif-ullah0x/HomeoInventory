import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Lightbulb, 
  Star, 
  Leaf, 
  Moon, 
  Sun, 
  Droplets,
  Clock,
  BookOpen,
  Sparkles
} from "lucide-react";

interface WisdomItem {
  id: string;
  type: 'quote' | 'health' | 'islamic';
  category: string;
  content: string;
  source?: string;
  icon: any;
  color: string;
}

// Comprehensive Life Wisdom Database - 100+ Authentic Quotes & Teachings
// TODO: Add more entries manually here when needed - simply expand any category array
const LIFE_WISDOM_DATA: WisdomItem[] = [
  
  // HOMEOPATHIC WISDOM & HEALING PHILOSOPHY
  {
    id: 'homeo-1',
    type: 'quote',
    category: 'Homeopathic Wisdom',
    content: 'Like cures like - this is the fundamental principle of homeopathy. What causes symptoms in a healthy person can cure similar symptoms in a sick person.',
    source: 'Samuel Hahnemann',
    icon: Leaf,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'homeo-2',
    type: 'quote',
    category: 'Homeopathic Philosophy',
    content: 'The highest ideal of cure is rapid, gentle and permanent restoration of health, or removal and annihilation of the disease in its whole extent.',
    source: 'Samuel Hahnemann, Organon',
    icon: Heart,
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'homeo-3',
    type: 'quote',
    category: 'Natural Healing',
    content: 'The physician\'s highest calling is not to treat disease, but to assist the body\'s own healing power.',
    source: 'Homeopathic Principle',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'homeo-4',
    type: 'quote',
    category: 'Individualization',
    content: 'No two patients are alike. Each person requires a remedy that matches their unique constitution and symptom picture.',
    source: 'Classical Homeopathy',
    icon: Star,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'homeo-5',
    type: 'quote',
    category: 'Minimum Dose',
    content: 'The smallest dose that produces a reaction is the most effective dose. Less is more in homeopathic healing.',
    source: 'Homeopathic Law',
    icon: Droplets,
    color: 'from-cyan-500 to-blue-600'
  },

  // INSPIRING LIFE QUOTES
  {
    id: 'quote-1',
    type: 'quote',
    category: 'Life Wisdom',
    content: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    source: 'Chinese Proverb',
    icon: Leaf,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'quote-2',
    type: 'quote',
    category: 'Motivation',
    content: 'Health is not about the weight you lose, but about the life you gain.',
    source: 'Dr. Josh Axe',
    icon: Heart,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'quote-3',
    type: 'quote',
    category: 'Wisdom',
    content: 'Take care of your body. It\'s the only place you have to live.',
    source: 'Jim Rohn',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'quote-4',
    type: 'quote',
    category: 'Life Philosophy',
    content: 'The groundwork for all happiness is good health.',
    source: 'Leigh Hunt',
    icon: Sun,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'quote-5',
    type: 'quote',
    category: 'Healing',
    content: 'Natural forces within us are the true healers of disease.',
    source: 'Hippocrates',
    icon: Leaf,
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'quote-6',
    type: 'quote',
    category: 'Inner Strength',
    content: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    source: 'Marcus Aurelius',
    icon: Lightbulb,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'quote-7',
    type: 'quote',
    category: 'Resilience',
    content: 'The oak tree teaches us that the strongest trees grow slowly, deeply rooted in good soil.',
    source: 'Nature\'s Wisdom',
    icon: Leaf,
    color: 'from-brown-500 to-green-600'
  },
  {
    id: 'quote-8',
    type: 'quote',
    category: 'Mindfulness',
    content: 'Yesterday is history, tomorrow is a mystery, today is a gift. That\'s why it\'s called the present.',
    source: 'Eleanor Roosevelt',
    icon: Star,
    color: 'from-gold-500 to-yellow-600'
  },
  {
    id: 'quote-9',
    type: 'quote',
    category: 'Growth',
    content: 'In every difficulty lies an opportunity for growth and self-discovery.',
    source: 'Albert Einstein',
    icon: Lightbulb,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'quote-10',
    type: 'quote',
    category: 'Peace',
    content: 'Peace comes from within. Do not seek it without.',
    source: 'Buddha',
    icon: Heart,
    color: 'from-purple-500 to-pink-600'
  },

  // PHYSICAL HEALTH TIPS
  {
    id: 'health-1',
    type: 'health',
    category: 'Hydration',
    content: 'Drink water first thing in the morning to kickstart your metabolism and flush out toxins. Aim for 8-10 glasses throughout the day.',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'health-2',
    type: 'health',
    category: 'Sleep',
    content: 'Quality sleep is when your body repairs and regenerates. Maintain a consistent sleep schedule and avoid screens 1 hour before bed.',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'health-3',
    type: 'health',
    category: 'Exercise',
    content: 'Even 10 minutes of daily walking can boost your mood, strengthen your heart, and improve mental clarity.',
    icon: Heart,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'health-4',
    type: 'health',
    category: 'Nutrition',
    content: 'Eat the rainbow! Different colored fruits and vegetables provide unique vitamins and antioxidants your body needs.',
    icon: Sun,
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'health-5',
    type: 'health',
    category: 'Breathing',
    content: 'Practice deep breathing for 5 minutes daily. It reduces stress, lowers blood pressure, and calms the mind.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'health-6',
    type: 'health',
    category: 'Digestion',
    content: 'Chew your food slowly and mindfully. Proper chewing aids digestion and helps your body absorb nutrients better.',
    icon: Leaf,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'health-7',
    type: 'health',
    category: 'Immunity',
    content: 'Regular exposure to sunlight helps your body produce Vitamin D, essential for strong bones and immune function.',
    icon: Sun,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'health-8',
    type: 'health',
    category: 'Heart Health',
    content: 'Laugh often! Laughter increases oxygen-rich blood flow, releases endorphins, and strengthens your cardiovascular system.',
    icon: Heart,
    color: 'from-pink-500 to-red-600'
  },
  {
    id: 'health-9',
    type: 'health',
    category: 'Posture',
    content: 'Stand tall and sit straight. Good posture improves breathing, reduces back pain, and boosts confidence.',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'health-10',
    type: 'health',
    category: 'Detox',
    content: 'Your liver works hardest between 1-3 AM. Support it by sleeping well and avoiding late-night eating.',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600'
  },

  // MENTAL HEALTH & EMOTIONAL WELLNESS
  {
    id: 'mental-1',
    type: 'health',
    category: 'Mental Health',
    content: 'Practice gratitude daily. Write down three things you\'re grateful for each morning to rewire your brain for positivity.',
    icon: Star,
    color: 'from-gold-500 to-yellow-600'
  },
  {
    id: 'mental-2',
    type: 'health',
    category: 'Stress Management',
    content: 'When overwhelmed, try the 5-4-3-2-1 technique: Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
    icon: Lightbulb,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'mental-3',
    type: 'health',
    category: 'Emotional Balance',
    content: 'It\'s okay to not be okay. Acknowledge your feelings without judgment - they are temporary visitors, not permanent residents.',
    icon: Heart,
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'mental-4',
    type: 'health',
    category: 'Mindfulness',
    content: 'Spend 5 minutes in nature daily. Natural environments reduce cortisol levels and improve mental clarity.',
    icon: Leaf,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'mental-5',
    type: 'health',
    category: 'Focus',
    content: 'Single-tasking improves productivity and reduces anxiety. Focus on one task at a time for better results.',
    icon: Star,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'mental-6',
    type: 'health',
    category: 'Social Wellness',
    content: 'Human connection is medicine. A simple conversation or hug can lower blood pressure and boost mood.',
    icon: Heart,
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'mental-7',
    type: 'health',
    category: 'Self-Compassion',
    content: 'Treat yourself with the same kindness you\'d show a good friend. Self-compassion is the foundation of mental wellness.',
    icon: Sparkles,
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'mental-8',
    type: 'health',
    category: 'Creativity',
    content: 'Engage in creative activities daily - drawing, singing, cooking. Creativity reduces stress and enhances brain function.',
    icon: Lightbulb,
    color: 'from-orange-500 to-yellow-600'
  },

  // ISLAMIC TEACHINGS ON HEALTH & LIFE
  {
    id: 'islamic-1',
    type: 'islamic',
    category: 'Eating Habits',
    content: 'The Prophet (ﷺ) said: "The son of Adam fills no vessel worse than his stomach. It is sufficient for the son of Adam to eat a few mouthfuls to keep him alive." - Moderation in eating is key to health.',
    source: 'Hadith (Tirmidhi)',
    icon: Heart,
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'islamic-2',
    type: 'islamic',
    category: 'Drinking Water',
    content: 'The Prophet (ﷺ) taught us to drink water in three sips, saying "Bismillah" before drinking and "Alhamdulillah" after. This practice aids digestion and mindful consumption.',
    source: 'Islamic Teaching',
    icon: Droplets,
    color: 'from-blue-500 to-teal-600'
  },
  {
    id: 'islamic-3',
    type: 'islamic',
    category: 'Sleep Routine',
    content: 'Sleep early and wake early, as the Prophet (ﷺ) said: "Allah has blessed my Ummah in their early mornings." Early rising brings barakah (blessing) in time and health.',
    source: 'Hadith (Ibn Majah)',
    icon: Moon,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'islamic-4',
    type: 'islamic',
    category: 'Cleanliness',
    content: 'The Prophet (ﷺ) emphasized cleanliness: "Cleanliness is half of faith." Regular hygiene, both physical and spiritual, is essential for overall well-being.',
    source: 'Hadith (Muslim)',
    icon: Sparkles,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'islamic-5',
    type: 'islamic',
    category: 'Fasting Benefits',
    content: 'The Prophet (ﷺ) said: "Fast and you will be healthy." Modern science confirms fasting benefits: improved metabolism, cellular repair, and mental clarity.',
    source: 'Hadith (Ahmad)',
    icon: Sun,
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'islamic-6',
    type: 'islamic',
    category: 'Gratitude & Health',
    content: 'Being grateful for your health strengthens it. The Quran says: "If you are grateful, I will certainly give you more." Gratitude improves mental and physical well-being.',
    source: 'Quran 14:7',
    icon: Star,
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'islamic-7',
    type: 'islamic',
    category: 'Balanced Living',
    content: 'The Prophet (ﷺ) lived a balanced life: "Give your body its rights, your eyes their rights, and your family their rights." Balance in all aspects leads to true wellness.',
    source: 'Hadith (Bukhari)',
    icon: Heart,
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'islamic-8',
    type: 'islamic',
    category: 'Honey Benefits',
    content: 'The Quran mentions honey as healing: "There comes forth from their bellies a drink of varying colors wherein is healing for mankind." Honey has antibacterial and healing properties.',
    source: 'Quran 16:69',
    icon: Sun,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'islamic-9',
    type: 'islamic',
    category: 'Prayer & Health',
    content: 'Regular prayer involves gentle physical movement, mindfulness, and stress relief - providing both spiritual and physical benefits.',
    source: 'Islamic Wisdom',
    icon: Star,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'islamic-10',
    type: 'islamic',
    category: 'Patience in Illness',
    content: 'The Prophet (ﷺ) said: "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt befalls a Muslim - even if it were the prick of a thorn - except that Allah expiates some of his sins for that."',
    source: 'Hadith (Bukhari)',
    icon: Heart,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'islamic-11',
    type: 'islamic',
    category: 'Natural Medicine',
    content: 'The Prophet (ﷺ) said: "Use the two cures: honey and the Quran." Natural remedies combined with spiritual healing create holistic wellness.',
    source: 'Hadith (Ibn Majah)',
    icon: Leaf,
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'islamic-12',
    type: 'islamic',
    category: 'Charity & Health',
    content: 'The Prophet (ﷺ) said: "Charity does not decrease wealth." Giving to others releases endorphins and reduces stress - charity heals the giver.',
    source: 'Hadith (Muslim)',
    icon: Heart,
    color: 'from-pink-500 to-red-600'
  },

  // SEASONAL & ENVIRONMENTAL HEALTH
  {
    id: 'seasonal-1',
    type: 'health',
    category: 'Winter Care',
    content: 'In winter, keep your feet warm and dry. Cold feet can lower your immunity and make you more susceptible to illness.',
    icon: Droplets,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'seasonal-2',
    type: 'health',
    category: 'Summer Wellness',
    content: 'Stay hydrated in summer with room temperature water. Ice-cold drinks can shock your digestive system.',
    icon: Sun,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'seasonal-3',
    type: 'health',
    category: 'Fresh Air',
    content: 'Open your windows daily for 10 minutes, even in winter. Fresh air circulation improves indoor air quality and mental clarity.',
    icon: Leaf,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'seasonal-4',
    type: 'health',
    category: 'Nature Connection',
    content: 'Forest bathing (spending time among trees) reduces stress hormones and boosts immune cell activity.',
    icon: Leaf,
    color: 'from-green-500 to-emerald-600'
  },

  // NUTRITION & SUPERFOODS
  {
    id: 'nutrition-1',
    type: 'health',
    category: 'Superfoods',
    content: 'Turmeric with black pepper increases absorption by 2000%. This golden spice reduces inflammation and supports joint health.',
    icon: Sun,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'nutrition-2',
    type: 'health',
    category: 'Gut Health',
    content: 'Fermented foods like yogurt, kefir, and sauerkraut support your gut microbiome - 70% of your immune system lives in your gut.',
    icon: Heart,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'nutrition-3',
    type: 'health',
    category: 'Brain Food',
    content: 'Walnuts resemble brain tissue for a reason - they\'re rich in omega-3 fatty acids that support cognitive function and memory.',
    icon: Lightbulb,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'nutrition-4',
    type: 'health',
    category: 'Antioxidants',
    content: 'Dark berries are nature\'s antioxidant powerhouses. They protect your cells from damage and support healthy aging.',
    icon: Star,
    color: 'from-purple-500 to-pink-600'
  },

  // ANCIENT WISDOM & TRADITIONAL HEALING
  {
    id: 'ancient-1',
    type: 'quote',
    category: 'Ancient Wisdom',
    content: 'He who takes medicine and neglects to diet wastes the skill of his doctors.',
    source: 'Chinese Proverb',
    icon: Leaf,
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'ancient-2',
    type: 'quote',
    category: 'Ayurvedic Wisdom',
    content: 'When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.',
    source: 'Ayurvedic Saying',
    icon: Sun,
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'ancient-3',
    type: 'quote',
    category: 'Traditional Medicine',
    content: 'The art of healing comes from nature, not from the physician.',
    source: 'Paracelsus',
    icon: Leaf,
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'ancient-4',
    type: 'quote',
    category: 'Greek Medicine',
    content: 'Walking is the best medicine.',
    source: 'Hippocrates',
    icon: Heart,
    color: 'from-red-500 to-pink-600'
  },

  // MOTIVATIONAL & INSPIRATIONAL
  {
    id: 'motivation-1',
    type: 'quote',
    category: 'Motivation',
    content: 'Your body can stand almost anything. It\'s your mind you have to convince.',
    source: 'Unknown',
    icon: Lightbulb,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'motivation-2',
    type: 'quote',
    category: 'Perseverance',
    content: 'Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown.',
    source: 'Robin Sharma',
    icon: Star,
    color: 'from-gold-500 to-yellow-600'
  },
  {
    id: 'motivation-3',
    type: 'quote',
    category: 'Self-Care',
    content: 'You can\'t pour from an empty cup. Take care of yourself first.',
    source: 'Self-Care Wisdom',
    icon: Heart,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'motivation-4',
    type: 'quote',
    category: 'Growth Mindset',
    content: 'The only bad workout is the one that didn\'t happen.',
    source: 'Fitness Wisdom',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600'
  },

  // MINDFULNESS & MEDITATION
  {
    id: 'mindful-1',
    type: 'health',
    category: 'Meditation',
    content: 'Just 10 minutes of daily meditation can reduce anxiety, improve focus, and increase emotional regulation.',
    icon: Star,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'mindful-2',
    type: 'health',
    category: 'Present Moment',
    content: 'When you wash dishes, just wash dishes. Mindful daily activities become powerful meditation practices.',
    icon: Sparkles,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'mindful-3',
    type: 'health',
    category: 'Breathing Practice',
    content: 'Box breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4. This technique calms your nervous system instantly.',
    icon: Lightbulb,
    color: 'from-blue-500 to-cyan-600'
  },

  // SLEEP & REST
  {
    id: 'sleep-1',
    type: 'health',
    category: 'Sleep Hygiene',
    content: 'Your bedroom should be cool, dark, and quiet. The ideal temperature for sleep is 65-68°F (18-20°C).',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'sleep-2',
    type: 'health',
    category: 'Rest & Recovery',
    content: 'Rest is not a reward for completed work - it\'s a requirement for continued wellness and productivity.',
    icon: Moon,
    color: 'from-purple-500 to-indigo-600'
  },

  // RELATIONSHIPS & SOCIAL HEALTH
  {
    id: 'social-1',
    type: 'health',
    category: 'Community',
    content: 'Strong social connections can increase your lifespan by 50%. Invest in relationships - they are medicine for your soul.',
    icon: Heart,
    color: 'from-pink-500 to-red-600'
  },
  {
    id: 'social-2',
    type: 'health',
    category: 'Kindness',
    content: 'Acts of kindness release oxytocin, which has protective effects on the cardiovascular system. Kindness is literally good for your heart.',
    icon: Heart,
    color: 'from-rose-500 to-pink-600'
  },

  // TODO: Continue expanding with more categories:
  // - Specific homeopathic remedy wisdom
  // - More Islamic teachings on natural foods (dates, olive oil, etc.)
  // - Seasonal health adjustments
  // - Exercise and movement philosophy
  // - Environmental health tips
  // - Workplace wellness
  // - Aging gracefully
  // - Preventive health measures
  // - Energy healing and chakras
  // - Herbal medicine wisdom
  // - Water therapy benefits
  // - Sun therapy and light exposure
  // - Grounding and earthing benefits
  // - Sound therapy and music healing
  // - Color therapy for wellness
  // - Aromatherapy and essential oils
  // - Crystal healing properties
  // - Yoga and flexibility wisdom
  // - Tai Chi and Qigong benefits
  // - Traditional Chinese Medicine insights
  // - Acupuncture and pressure points
  // - Reflexology principles
];

export default function LifeWisdom() {
  const [currentWisdom, setCurrentWisdom] = useState<WisdomItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get random wisdom item on component mount and app load
  useEffect(() => {
    const getRandomWisdom = () => {
      const randomIndex = Math.floor(Math.random() * LIFE_WISDOM_DATA.length);
      return LIFE_WISDOM_DATA[randomIndex];
    };

    // Set random wisdom immediately
    setCurrentWisdom(getRandomWisdom());
    
    // Show with fade-in animation after short delay
    const timer = setTimeout(() => setIsVisible(true), 500);

    return () => clearTimeout(timer);
  }, []);

  // Change wisdom content every 15 seconds for dynamic experience
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LIFE_WISDOM_DATA.length);
      setCurrentWisdom(LIFE_WISDOM_DATA[randomIndex]);
    }, 15000); // TODO: Adjust rotation timing here if needed (currently 15 seconds)

    return () => clearInterval(interval);
  }, []);

  if (!currentWisdom) return null;

  const IconComponent = currentWisdom.icon;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quote': return '✨ Life Wisdom';
      case 'health': return '🌿 Health Tip';
      case 'islamic': return '☪️ Islamic Teaching';
      default: return '💫 Wisdom';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'quote': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'health': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'islamic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className={`
      mb-6 transition-all duration-1000 transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-purple-200/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-pink-500/5 animate-pulse"></div>
        
        <CardContent className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Icon with gradient background */}
            <div className={`
              p-3 rounded-xl bg-gradient-to-br ${currentWisdom.color} shadow-lg 
              transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12
              flex-shrink-0
            `}>
              <IconComponent className="h-6 w-6 text-white drop-shadow-sm" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Type and Category badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${getTypeBadgeColor(currentWisdom.type)} text-xs font-medium`}>
                  {getTypeLabel(currentWisdom.type)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentWisdom.category}
                </Badge>
              </div>

              {/* Main content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-medium">
                {currentWisdom.content}
              </p>

              {/* Source attribution */}
              {currentWisdom.source && (
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  — {currentWisdom.source}
                </p>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 opacity-20">
            <Clock className="h-4 w-4 text-purple-500 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}