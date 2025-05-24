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

// Comprehensive Life Wisdom Database
// TODO: Add more entries manually here when needed - simply expand any category array
const LIFE_WISDOM_DATA: WisdomItem[] = [
  // Inspiring Life Quotes
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

  // Health Tips
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
    category: 'Mental Health',
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

  // Islamic Teachings on Health & Life
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
    category: 'Daily Habits',
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

  // TODO: Manually add more entries here as needed:
  // - More inspiring quotes from various cultures and wisdom traditions
  // - Seasonal health tips (winter care, summer hydration, etc.)
  // - Specific Islamic teachings on honey, dates, olive oil benefits
  // - Mental health and stress management tips
  // - Exercise and movement wisdom
  // - Nutrition facts and healthy cooking tips
  // - Sleep hygiene and rest importance
  // - Environmental health (fresh air, nature connection)
  // - Social wellness and community health
  // - Preventive health measures and immunity boosting
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