import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Star, 
  Sparkles,
  Shield,
  Heart,
  TrendingUp,
  Zap,
  Info,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Gem
} from "lucide-react";

const navaratna = [
  {
    name: "Ruby",
    hindi: "Manik",
    planet: "Sun (Surya)",
    color: "bg-red-600",
    textColor: "text-red-600",
    metal: "Gold",
    day: "Sunday",
    finger: "Ring",
    benefits: [
      "Enhances vitality, confidence, and authority",
      "Brings fame, recognition, and career success",
      "Strengthens heart and circulation",
      "Ideal for leaders and government officials"
    ],
    chakra: "Solar Plexus",
    element: "Fire"
  },
  {
    name: "Pearl",
    hindi: "Moti",
    planet: "Moon (Chandra)",
    color: "bg-gray-100 border border-gray-300",
    textColor: "text-gray-600",
    metal: "Silver",
    day: "Monday",
    finger: "Little",
    benefits: [
      "Promotes emotional balance and mental clarity",
      "Enhances intuition and maternal relationships",
      "Reduces stress, anxiety, promotes peaceful sleep",
      "Good for therapists, artists, caregivers"
    ],
    chakra: "Sacral",
    element: "Water"
  },
  {
    name: "Red Coral",
    hindi: "Moonga",
    planet: "Mars (Mangal)",
    color: "bg-orange-600",
    textColor: "text-orange-600",
    metal: "Gold/Copper",
    day: "Tuesday",
    finger: "Ring",
    benefits: [
      "Boosts physical strength and courage",
      "Removes obstacles, helps overcome enemies",
      "Beneficial for Manglik Dosha",
      "Improves blood circulation, good for athletes"
    ],
    chakra: "Root",
    element: "Fire"
  },
  {
    name: "Emerald",
    hindi: "Panna",
    planet: "Mercury (Budh)",
    color: "bg-green-600",
    textColor: "text-green-600",
    metal: "Gold",
    day: "Wednesday",
    finger: "Little",
    benefits: [
      "Sharpens intellect and communication skills",
      "Promotes business success and analytical thinking",
      "Beneficial for students, writers, traders",
      "Supports heart chakra and emotional balance"
    ],
    chakra: "Heart",
    element: "Earth"
  },
  {
    name: "Yellow Sapphire",
    hindi: "Pukhraj",
    planet: "Jupiter (Guru)",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    metal: "Gold",
    day: "Thursday",
    finger: "Index",
    benefits: [
      "Brings wealth, wisdom, and spiritual growth",
      "Enhances marital happiness and good fortune",
      "Beneficial for teachers, scholars, advisors",
      "Supports liver, digestion, immune system"
    ],
    chakra: "Solar Plexus",
    element: "Ether"
  },
  {
    name: "Diamond",
    hindi: "Heera",
    planet: "Venus (Shukra)",
    color: "bg-cyan-100 border border-cyan-300",
    textColor: "text-cyan-700",
    metal: "Platinum/Silver",
    day: "Friday",
    finger: "Middle",
    benefits: [
      "Enhances love, beauty, and artistic talent",
      "Strengthens relationships, charm, romance",
      "Promotes creativity in arts, fashion, media",
      "Beneficial for artists, designers, performers"
    ],
    chakra: "Crown",
    element: "Air"
  },
  {
    name: "Blue Sapphire",
    hindi: "Neelam",
    planet: "Saturn (Shani)",
    color: "bg-blue-800",
    textColor: "text-blue-800",
    metal: "Silver/Iron",
    day: "Saturday",
    finger: "Middle",
    benefits: [
      "Promotes discipline and long-term goals",
      "Brings instant career success (requires caution)",
      "Enhances mental clarity, reduces anxiety",
      "Must be tested before wearing"
    ],
    chakra: "Third Eye",
    element: "Air",
    caution: true
  },
  {
    name: "Hessonite",
    hindi: "Gomed",
    planet: "Rahu (North Node)",
    color: "bg-amber-700",
    textColor: "text-amber-700",
    metal: "Silver",
    day: "Saturday",
    finger: "Middle",
    benefits: [
      "Wards off confusion and negative energies",
      "Promotes financial stability and peace",
      "Beneficial for political success",
      "Regulates blood pressure, reduces stress"
    ],
    chakra: "Root",
    element: "Earth",
    caution: true
  },
  {
    name: "Cat's Eye",
    hindi: "Lehsunia",
    planet: "Ketu (South Node)",
    color: "bg-lime-700",
    textColor: "text-lime-700",
    metal: "Silver",
    day: "Tuesday",
    finger: "Middle",
    benefits: [
      "Fosters spiritual awareness and intuition",
      "Restores financial losses, revives businesses",
      "Protects against evil spirits and envy",
      "Promotes self-awareness and good luck"
    ],
    chakra: "Crown",
    element: "Ether",
    caution: true
  }
];

const ascendantRecommendations = [
  { sign: "Aries (Mesh)", gems: ["Yellow Sapphire", "Ruby", "Red Coral", "Pearl"] },
  { sign: "Taurus (Vrishabh)", gems: ["Diamond", "Emerald", "Blue Sapphire"] },
  { sign: "Gemini (Mithun)", gems: ["Emerald", "Diamond"] },
  { sign: "Cancer (Kark)", gems: ["Pearl", "Red Coral", "Yellow Sapphire", "Ruby"] },
  { sign: "Leo (Simha)", gems: ["Ruby", "Yellow Sapphire", "Red Coral"] },
  { sign: "Virgo (Kanya)", gems: ["Emerald", "Blue Sapphire", "Diamond"] },
  { sign: "Libra (Tula)", gems: ["Diamond", "Blue Sapphire", "Emerald"] },
  { sign: "Scorpio (Vrishchik)", gems: ["Red Coral", "Yellow Sapphire", "Pearl"] },
  { sign: "Sagittarius (Dhanu)", gems: ["Yellow Sapphire", "Ruby", "Red Coral"] },
  { sign: "Capricorn (Makar)", gems: ["Blue Sapphire", "Emerald", "Diamond"] },
  { sign: "Aquarius (Kumbh)", gems: ["Blue Sapphire", "Emerald", "Diamond"] },
  { sign: "Pisces (Meen)", gems: ["Yellow Sapphire", "Pearl", "Red Coral"] }
];

const wearingGuidelines = [
  {
    icon: Sparkles,
    title: "Quality Matters",
    description: "Use only natural, untreated, flawless gemstones for astrological benefits"
  },
  {
    icon: Shield,
    title: "Metal Setting",
    description: "Set in prescribed metals (Gold/Silver) with stone touching skin directly"
  },
  {
    icon: Calendar,
    title: "Auspicious Timing",
    description: "Wear before sunrise on the ruled day after energization with mantras"
  },
  {
    icon: Star,
    title: "Professional Consultation",
    description: "Always consult a Vedic astrologer before wearing any gemstone"
  }
];

export default function GemstoneGuidePage() {
  const [selectedGem, setSelectedGem] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Gem className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Navaratna - Nine Sacred Gems</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Vedic Gemstone Guide
            </h1>
            
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Discover the power of the nine sacred gemstones in Vedic astrology. Learn which gems align with your planetary energies for health, wealth, and spiritual growth
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>9 Planetary Gems</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Ancient Wisdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Personalized Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Navaratna Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              The Nine Sacred Gemstones
            </h2>
            <p className="text-muted-foreground">
              Click on any gemstone to learn about its benefits, planetary association, and how to wear it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {navaratna.map((gem, index) => (
              <Card 
                key={index}
                className={`hover-elevate cursor-pointer transition-all ${
                  selectedGem === index ? 'ring-2 ring-purple-500 border-purple-300' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedGem(selectedGem === index ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedGem(selectedGem === index ? null : index);
                  }
                }}
                data-testid={`card-gem-${gem.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-12 w-12 rounded-full ${gem.color} flex items-center justify-center flex-shrink-0`}>
                      <Gem className="h-6 w-6 text-white" />
                    </div>
                    {gem.caution && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Caution
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{gem.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="font-medium text-sm">{gem.hindi}</div>
                    <div className={`font-semibold ${gem.textColor}`}>{gem.planet}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <span className="text-muted-foreground">Metal:</span>
                      <p className="font-medium">{gem.metal}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Day:</span>
                      <p className="font-medium">{gem.day}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Finger:</span>
                      <p className="font-medium">{gem.finger}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Element:</span>
                      <p className="font-medium">{gem.element}</p>
                    </div>
                  </div>

                  {selectedGem === index && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Benefits:
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {gem.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <p className="text-xs">
                          <span className="font-semibold">Chakra:</span> {gem.chakra}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="ascendant" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ascendant" data-testid="tab-ascendant">By Ascendant</TabsTrigger>
            <TabsTrigger value="guidelines" data-testid="tab-guidelines">How to Wear</TabsTrigger>
            <TabsTrigger value="cautions" data-testid="tab-cautions">Important Notes</TabsTrigger>
          </TabsList>
          
          {/* Recommendations by Ascendant */}
          <TabsContent value="ascendant" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Gemstone Recommendations by Ascendant
                </CardTitle>
                <CardDescription>
                  Find the best gemstones for your rising sign (Lagna). For accurate recommendations, consult an astrologer with your complete birth chart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ascendantRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-400">
                        {rec.sign}
                      </h4>
                      <div className="space-y-2">
                        {rec.gems.map((gem, i) => (
                          <Badge key={i} variant="secondary" className="mr-2 mb-2">
                            {gem}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* How to Wear Guidelines */}
          <TabsContent value="guidelines" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Essential Guidelines for Wearing Gemstones
                </CardTitle>
                <CardDescription>
                  Follow these ancient Vedic principles for maximum astrological benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {wearingGuidelines.map((guideline, index) => {
                    const Icon = guideline.icon;
                    return (
                      <div key={index} className="flex gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <Icon className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">{guideline.title}</h4>
                          <p className="text-sm text-muted-foreground">{guideline.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Step-by-Step Process</h3>
                  <div className="space-y-3">
                    {[
                      "Consult a qualified Vedic astrologer to analyze your birth chart",
                      "Purchase natural, certified gemstones from reputable dealers",
                      "Get the gemstone set in the prescribed metal with proper weight",
                      "Energize the gemstone with Navagraha mantras (ask your astrologer)",
                      "Wear on the prescribed day, finger, and time (preferably at sunrise)",
                      "Clean regularly with pure water and recharge under moonlight"
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <Badge className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-sm pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Important Cautions */}
          <TabsContent value="cautions" className="mt-6">
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Important Cautions & Considerations
                </CardTitle>
                <CardDescription>
                  Read these carefully before wearing any gemstone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      title: "Blue Sapphire (Neelam) - Most Powerful & Risky",
                      content: "Blue Sapphire can bring instant success or immediate problems if incompatible. Must be tested for 7 days before permanent wearing. Never wear without expert consultation."
                    },
                    {
                      title: "Rahu & Ketu Stones - Shadow Planets",
                      content: "Hessonite (Gomed) and Cat's Eye (Lehsunia) are powerful but can cause adverse effects if incompatible. Require careful birth chart analysis."
                    },
                    {
                      title: "Gemstone Incompatibility",
                      content: "Never wear incompatible gemstones together (e.g., Ruby with Blue Sapphire, Pearl with Hessonite). They can cancel each other's benefits or cause harm."
                    },
                    {
                      title: "Quality is Critical",
                      content: "Synthetic, treated, or flawed gemstones have no astrological value and may cause negative effects. Always buy certified natural stones."
                    },
                    {
                      title: "Malefic House Stones",
                      content: "Avoid wearing gemstones for planets ruling 6th, 8th, or 12th houses in your chart without expert guidance. These can amplify difficulties."
                    },
                    {
                      title: "Not a Substitute for Action",
                      content: "Gemstones support planetary energies but are not magical solutions. They work best when combined with positive actions, prayers, and ethical living."
                    }
                  ].map((caution, index) => (
                    <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">
                        {caution.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{caution.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-purple-600" />
                    Golden Rule
                  </h4>
                  <p className="text-sm">
                    <strong>Always consult a qualified Vedic astrologer before wearing any gemstone.</strong> A professional analysis of your complete birth chart (Kundali) is essential to determine which gemstones will benefit you and which could cause harm.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Consultation CTA */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <Gem className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-xl mb-2">Get Personalized Gemstone Recommendations</h3>
                <p className="text-muted-foreground">
                  Our expert astrologers will analyze your birth chart and recommend the perfect gemstones for your unique planetary positions, along with wearing instructions and mantras
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" data-testid="button-consultation">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button variant="outline" data-testid="button-kundali">
                  <Star className="h-4 w-4 mr-2" />
                  Create Kundali First
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Understanding Navaratna in Vedic Astrology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Navaratna (Sanskrit: नवरत्न) means "nine gems" and represents the nine sacred gemstones corresponding to the Navagraha (nine celestial deities) in Vedic astrology. These gemstones are believed to channel cosmic planetary energies, bringing balance, protection, prosperity, and spiritual growth to the wearer.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    How They Work
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Gemstones emit specific vibrations that resonate with planetary frequencies. When worn correctly, they strengthen benefic planets and pacify malefic influences in your birth chart.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Ancient Wisdom
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sacred texts like Brihat Samhita, Garuda Purana, and Jataka Parijata detail gemstone properties. Kings wore Navaratna jewelry for divine protection and cosmic balance.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-purple-600" />
                    Holistic Benefits
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Beyond material gains, gemstones promote physical health, mental clarity, emotional balance, and spiritual evolution when used with devotion and proper guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

