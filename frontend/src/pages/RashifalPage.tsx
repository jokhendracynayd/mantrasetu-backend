import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Star, 
  TrendingUp, 
  Heart, 
  Briefcase, 
  DollarSign,
  Activity,
  Sparkles,
  Calendar,
  Info,
  BookOpen,
  Zap
} from "lucide-react";

const zodiacSigns = [
  { 
    id: "aries", 
    name: "Aries", 
    hindiName: "Mesh (मेष)", 
    symbol: "♈", 
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    color: "bg-red-500",
    textColor: "text-red-600",
    ruling: "Mars"
  },
  { 
    id: "taurus", 
    name: "Taurus", 
    hindiName: "Vrishabh (वृषभ)", 
    symbol: "♉", 
    dates: "Apr 20 - May 20",
    element: "Earth",
    color: "bg-green-600",
    textColor: "text-green-600",
    ruling: "Venus"
  },
  { 
    id: "gemini", 
    name: "Gemini", 
    hindiName: "Mithun (मिथुन)", 
    symbol: "♊", 
    dates: "May 21 - Jun 20",
    element: "Air",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    ruling: "Mercury"
  },
  { 
    id: "cancer", 
    name: "Cancer", 
    hindiName: "Kark (कर्क)", 
    symbol: "♋", 
    dates: "Jun 21 - Jul 22",
    element: "Water",
    color: "bg-blue-400",
    textColor: "text-blue-600",
    ruling: "Moon"
  },
  { 
    id: "leo", 
    name: "Leo", 
    hindiName: "Simha (सिंह)", 
    symbol: "♌", 
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    ruling: "Sun"
  },
  { 
    id: "virgo", 
    name: "Virgo", 
    hindiName: "Kanya (कन्या)", 
    symbol: "♍", 
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    color: "bg-emerald-600",
    textColor: "text-emerald-600",
    ruling: "Mercury"
  },
  { 
    id: "libra", 
    name: "Libra", 
    hindiName: "Tula (तुला)", 
    symbol: "♎", 
    dates: "Sep 23 - Oct 22",
    element: "Air",
    color: "bg-pink-500",
    textColor: "text-pink-600",
    ruling: "Venus"
  },
  { 
    id: "scorpio", 
    name: "Scorpio", 
    hindiName: "Vrishchik (वृश्चिक)", 
    symbol: "♏", 
    dates: "Oct 23 - Nov 21",
    element: "Water",
    color: "bg-red-700",
    textColor: "text-red-700",
    ruling: "Mars"
  },
  { 
    id: "sagittarius", 
    name: "Sagittarius", 
    hindiName: "Dhanu (धनु)", 
    symbol: "♐", 
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    color: "bg-purple-600",
    textColor: "text-purple-600",
    ruling: "Jupiter"
  },
  { 
    id: "capricorn", 
    name: "Capricorn", 
    hindiName: "Makar (मकर)", 
    symbol: "♑", 
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    color: "bg-gray-700",
    textColor: "text-gray-700",
    ruling: "Saturn"
  },
  { 
    id: "aquarius", 
    name: "Aquarius", 
    hindiName: "Kumbh (कुंभ)", 
    symbol: "♒", 
    dates: "Jan 20 - Feb 18",
    element: "Air",
    color: "bg-cyan-500",
    textColor: "text-cyan-600",
    ruling: "Saturn"
  },
  { 
    id: "pisces", 
    name: "Pisces", 
    hindiName: "Meen (मीन)", 
    symbol: "♓", 
    dates: "Feb 19 - Mar 20",
    element: "Water",
    color: "bg-indigo-500",
    textColor: "text-indigo-600",
    ruling: "Jupiter"
  },
];

// Mock horoscope data
const mockHoroscopes = {
  daily: {
    overview: "Today brings positive energy and opportunities. Your intuition is strong - trust it.",
    career: "A new project or opportunity may come your way. Show confidence and take initiative.",
    love: "Communication flows smoothly in relationships. Express your feelings openly.",
    finance: "Good day for financial planning. Avoid impulsive purchases.",
    health: "Energy levels are high. Perfect time for physical activity or starting a new fitness routine.",
    lucky: {
      number: "7",
      color: "Blue",
      time: "2:00 PM - 4:00 PM"
    },
    rating: 4
  },
  weekly: {
    overview: "This week promises growth and new beginnings. Jupiter's favorable position brings optimism and expansion in all areas of life.",
    career: "Mid-week brings important meetings or decisions. Your hard work will be recognized. Thursday is particularly favorable for negotiations.",
    love: "Romantic energies are strong this week. Single natives may meet someone special at social gatherings. Couples should plan quality time together.",
    finance: "Financial prospects improve towards the weekend. A pending payment may come through. Avoid major investments until next week.",
    health: "Maintain balance between work and rest. Monday and Friday are good for starting new health regimens.",
    lucky: {
      days: "Wednesday, Friday",
      color: "Green, White",
      direction: "East"
    },
    rating: 4.5
  },
  monthly: {
    overview: "October 2025 is a month of transformation and achievement. Planetary alignments favor your personal and professional growth.",
    career: "First half of the month brings career advancement opportunities. Your leadership qualities shine. Negotiations started after the 15th will be successful.",
    love: "Venus in your 5th house enhances romance. Married couples experience renewed passion. Singles may find love through friends or social media.",
    finance: "Financial situation improves significantly. Expect gains from multiple sources. Property matters are favorable. Consider long-term investments.",
    health: "Overall health is good. Focus on preventive care. Yoga and meditation recommended for mental peace. Watch diet in the last week.",
    lucky: {
      dates: "5th, 12th, 18th, 25th",
      gemstone: "Yellow Sapphire",
      mantra: "Om Gurave Namah"
    },
    rating: 4.8
  }
};

export default function RashifalPage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  const getSelectedSignData = () => {
    return zodiacSigns.find(sign => sign.id === selectedSign);
  };

  const getCurrentHoroscope = () => {
    return mockHoroscopes[timeframe];
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars 
                ? "fill-yellow-400 text-yellow-400" 
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Vedic Astrology Predictions</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Rashifal - Today's Horoscope
            </h1>
            
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Discover what the stars have in store for you with accurate Vedic astrology predictions for all 12 zodiac signs
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Daily Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Powered by Vedic Wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!selectedSign ? (
          <>
            {/* Zodiac Sign Selection */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Select Your Zodiac Sign
              </h2>
              <p className="text-muted-foreground">
                Choose your sun sign or moon sign (Rashi) to view your personalized horoscope
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {zodiacSigns.map((sign) => (
                <Card 
                  key={sign.id}
                  className="hover-elevate cursor-pointer group transition-all"
                  onClick={() => setSelectedSign(sign.id)}
                  data-testid={`card-zodiac-${sign.id}`}
                >
                  <CardContent className="pt-6 text-center">
                    <div className={`h-16 w-16 rounded-full ${sign.color} flex items-center justify-center mx-auto mb-3 text-white text-3xl font-bold group-hover:scale-110 transition-transform`}>
                      {sign.symbol}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{sign.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{sign.hindiName}</p>
                    <Badge variant="secondary" className="text-xs">
                      {sign.dates}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Educational Section */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Understanding Vedic Astrology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Rashifal in Vedic astrology is based on your Moon sign (Janma Rashi) - the zodiac sign where the Moon was positioned at your birth. 
                  Unlike Western astrology which primarily uses Sun signs, Vedic astrology considers the Moon sign more significant as it represents your mind, emotions, and inner self.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      12 Zodiac Signs
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Each sign represents unique characteristics, ruling planets, and life patterns.
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      Planetary Transits
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Predictions based on current planetary positions and their effects on your sign.
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-green-500" />
                      Life Guidance
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Insights on career, love, health, and finances to help navigate life better.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Selected Sign Header */}
            {getSelectedSignData() && (
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedSign(null)}
                  className="mb-4"
                  data-testid="button-back"
                >
                  ← Back to All Signs
                </Button>
                
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className={`h-24 w-24 rounded-full ${getSelectedSignData()!.color} flex items-center justify-center text-white text-5xl font-bold flex-shrink-0`}>
                        {getSelectedSignData()!.symbol}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">
                          {getSelectedSignData()!.name} - {getSelectedSignData()!.hindiName}
                        </h2>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <Badge variant="secondary">{getSelectedSignData()!.dates}</Badge>
                          <Badge variant="secondary">Element: {getSelectedSignData()!.element}</Badge>
                          <Badge variant="secondary">Ruled by: {getSelectedSignData()!.ruling}</Badge>
                        </div>
                      </div>
                      <div className="text-center">
                        {renderRating(getCurrentHoroscope().rating)}
                        <p className="text-xs text-muted-foreground mt-1">Today's Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Timeframe Tabs */}
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="daily" data-testid="tab-daily">Today</TabsTrigger>
                <TabsTrigger value="weekly" data-testid="tab-weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly" data-testid="tab-monthly">This Month</TabsTrigger>
              </TabsList>
              
              <TabsContent value={timeframe}>
                <div className="space-y-6">
                  {/* Overall Prediction */}
                  <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        Overall Prediction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {getCurrentHoroscope().overview}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Life Aspects Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Career */}
                    <Card className="hover-elevate">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          Career & Business
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getCurrentHoroscope().career}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Love & Relationships */}
                    <Card className="hover-elevate">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Heart className="h-5 w-5 text-pink-600" />
                          Love & Relationships
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getCurrentHoroscope().love}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Finance */}
                    <Card className="hover-elevate">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Finance & Money
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getCurrentHoroscope().finance}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Health */}
                    <Card className="hover-elevate">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Activity className="h-5 w-5 text-red-600" />
                          Health & Wellness
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {getCurrentHoroscope().health}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Lucky Elements */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-yellow-600" />
                        Lucky Elements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(getCurrentHoroscope().lucky).map(([key, value]) => (
                          <div key={key} className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1 capitalize">{key}</p>
                            <p className="font-semibold">{value as string}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personalized Consultation CTA */}
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                          <Star className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="font-semibold text-lg mb-1">Want Detailed Personal Predictions?</h3>
                          <p className="text-sm text-muted-foreground">
                            Get a comprehensive horoscope analysis based on your complete birth chart from our expert astrologers
                          </p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-consultation">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Consultation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

