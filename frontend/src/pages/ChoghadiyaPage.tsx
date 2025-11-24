import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Clock, Sun, Moon, Calendar, ArrowRight, Star } from "lucide-react";

export default function ChoghadiyaPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Choghadiya types with their properties
  const choghadiyaTypes = [
    {
      name: "Amrit",
      hindi: "अमृत",
      meaning: "Nectar",
      planet: "Moon",
      quality: "excellent",
      color: "bg-emerald-500",
      description: "Most auspicious period for all important activities",
      suitable: ["Marriage ceremonies", "Starting new business", "Property deals", "Education initiation", "Medical treatment"],
      avoid: []
    },
    {
      name: "Shubh",
      hindi: "शुभ",
      meaning: "Auspicious",
      planet: "Jupiter",
      quality: "good",
      color: "bg-green-500",
      description: "Highly favorable for positive ventures and celebrations",
      suitable: ["Religious ceremonies", "Housewarming", "Starting new work", "Court cases", "Financial transactions"],
      avoid: []
    },
    {
      name: "Labh",
      hindi: "लाभ",
      meaning: "Profit",
      planet: "Mercury",
      quality: "good",
      color: "bg-blue-500",
      description: "Excellent for business and financial activities",
      suitable: ["Business deals", "Trading", "Investments", "Shopping", "Opening accounts"],
      avoid: []
    },
    {
      name: "Char",
      hindi: "चर",
      meaning: "Movable",
      planet: "Venus",
      quality: "good",
      color: "bg-cyan-500",
      description: "Best for travel and activities involving movement",
      suitable: ["Journey starting", "Vehicle purchase", "Relocation", "Transportation", "Courier services"],
      avoid: ["Permanent activities", "Foundation laying"]
    },
    {
      name: "Udveg",
      hindi: "उद्वेग",
      meaning: "Anxiety",
      planet: "Sun",
      quality: "inauspicious",
      color: "bg-orange-500",
      description: "Creates mental disturbance and obstacles",
      suitable: ["Dealing with enemies", "Legal disputes"],
      avoid: ["Important decisions", "New ventures", "Investments", "Marriage"]
    },
    {
      name: "Kal",
      hindi: "काल",
      meaning: "Death",
      planet: "Saturn",
      quality: "inauspicious",
      color: "bg-red-500",
      description: "Very unfavorable, causes loss and destruction",
      suitable: [],
      avoid: ["All important activities", "Ceremonies", "Business deals", "Travel"]
    },
    {
      name: "Rog",
      hindi: "रोग",
      meaning: "Disease",
      planet: "Mars",
      quality: "inauspicious",
      color: "bg-purple-500",
      description: "Brings health issues and negative outcomes",
      suitable: [],
      avoid: ["Medical procedures", "New ventures", "Celebrations", "Important meetings"]
    },
    {
      name: "Kaal Ratri",
      hindi: "काल रात्रि",
      meaning: "Dark Night",
      planet: "Rahu",
      quality: "inauspicious",
      color: "bg-gray-700",
      description: "Only occurs at night, most inauspicious period",
      suitable: [],
      avoid: ["All activities should be avoided during this time"]
    }
  ];

  // Generate sample timings for today
  const generateDayTimings = () => {
    const timings = [
      { type: "Udveg", start: "06:00", end: "07:30" },
      { type: "Char", start: "07:30", end: "09:00" },
      { type: "Labh", start: "09:00", end: "10:30" },
      { type: "Amrit", start: "10:30", end: "12:00" },
      { type: "Kal", start: "12:00", end: "13:30" },
      { type: "Shubh", start: "13:30", end: "15:00" },
      { type: "Rog", start: "15:00", end: "16:30" },
      { type: "Udveg", start: "16:30", end: "18:00" }
    ];
    return timings;
  };

  const generateNightTimings = () => {
    const timings = [
      { type: "Shubh", start: "18:00", end: "19:30" },
      { type: "Amrit", start: "19:30", end: "21:00" },
      { type: "Char", start: "21:00", end: "22:30" },
      { type: "Rog", start: "22:30", end: "00:00" },
      { type: "Kaal Ratri", start: "00:00", end: "01:30" },
      { type: "Labh", start: "01:30", end: "03:00" },
      { type: "Udveg", start: "03:00", end: "04:30" },
      { type: "Shubh", start: "04:30", end: "06:00" }
    ];
    return timings;
  };

  const dayTimings = generateDayTimings();
  const nightTimings = generateNightTimings();

  const getChoghadiyaColor = (type: string) => {
    const chog = choghadiyaTypes.find(c => c.name === type);
    return chog?.color || "bg-gray-500";
  };

  const getChoghadiyaQuality = (type: string) => {
    const chog = choghadiyaTypes.find(c => c.name === type);
    return chog?.quality || "neutral";
  };

  // Get current Choghadiya based on time
  const getCurrentChoghadiya = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // Determine if it's day or night (6 AM to 6 PM is day)
    const isDay = currentTime >= 6 && currentTime < 18;
    const timings = isDay ? dayTimings : nightTimings;

    // Find current period
    for (const timing of timings) {
      const [startHour, startMin] = timing.start.split(':').map(Number);
      const [endHour, endMin] = timing.end.split(':').map(Number);
      let startTime = startHour + startMin / 60;
      let endTime = endHour + endMin / 60;

      // Normalize times for comparison
      let normalizedCurrentTime = currentTime;
      let normalizedStartTime = startTime;
      let normalizedEndTime = endTime;

      // Handle periods that cross midnight (end <= start means it crosses midnight)
      if (endTime <= startTime) {
        normalizedEndTime = endTime + 24;
      }

      // For early morning hours (00:00 - 06:00), adjust current time and period boundaries
      if (currentTime < 6 && !isDay) {
        normalizedCurrentTime = currentTime + 24;
        
        // Adjust start and end times if they're in early morning range
        if (startTime < 6) {
          normalizedStartTime = startTime + 24;
        }
        if (endTime > 0 && endTime <= 6) {
          normalizedEndTime = endTime + 24;
        }
      }

      if (normalizedCurrentTime >= normalizedStartTime && normalizedCurrentTime < normalizedEndTime) {
        return timing;
      }
    }

    return timings[0]; // Default to first timing
  };

  const currentChoghadiya = getCurrentChoghadiya();
  const currentChogDetails = choghadiyaTypes.find(c => c.name === currentChoghadiya.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-900 dark:via-pink-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Clock className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Choghadiya Muhurat</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Choghadiya - Auspicious Timings
            </h1>
            <p className="text-xl text-orange-100 mb-2" data-testid="text-subtitle">
              चौघड़िया मुहूर्त - शुभ और अशुभ समय
            </p>
            <p className="text-lg text-white/80 mb-6 max-w-3xl mx-auto" data-testid="text-description">
              Ancient Vedic time division system for determining auspicious periods for daily activities
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Daily Timings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>8 Time Periods</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Current Choghadiya Status */}
        <Card className="mb-8 border-2 border-orange-200 dark:border-orange-800" data-testid="card-current-status">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl mb-2" data-testid="text-current-title">Current Choghadiya</CardTitle>
                <CardDescription data-testid="text-current-time">
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </div>
              <Badge className={`${currentChogDetails?.color || 'bg-emerald-500'} text-white text-lg px-4 py-2`} data-testid="badge-current-choghadiya">
                <Star className="h-4 w-4 mr-2" />
                {currentChoghadiya.type} ({currentChoghadiya.start} - {currentChoghadiya.end})
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2" data-testid="text-current-quality">
                  <span className={`h-3 w-3 rounded-full ${currentChogDetails?.color || 'bg-emerald-500'}`}></span>
                  Quality: {currentChogDetails?.quality === "excellent" ? "Excellent (Most Auspicious)" : currentChogDetails?.quality === "good" ? "Good (Favorable)" : "Inauspicious (Avoid)"}
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-current-description">
                  {currentChogDetails?.description || "Current time period"}
                </p>
                <p className="text-sm font-semibold text-primary" data-testid="text-current-planet">
                  Ruled by: {currentChogDetails?.planet}
                </p>
              </div>
              <div className="space-y-3">
                {currentChogDetails && currentChogDetails.suitable.length > 0 ? (
                  <>
                    <h3 className="font-semibold text-green-700 dark:text-green-400" data-testid="text-suitable-for">✓ Suitable For:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5" data-testid="list-suitable-activities">
                      {currentChogDetails.suitable.slice(0, 4).map((activity, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-red-600 dark:text-red-400" data-testid="text-avoid-activities">⚠️ Avoid Activities:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5" data-testid="list-avoid-activities">
                      {currentChogDetails?.avoid.slice(0, 4).map((activity, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day and Night Timings */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Day Choghadiya */}
          <Card className="hover-elevate" data-testid="card-day-timings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-day-title">
                <Sun className="h-5 w-5 text-orange-500" />
                Day Choghadiya
              </CardTitle>
              <CardDescription data-testid="text-day-period">Sunrise to Sunset (06:00 AM - 06:00 PM)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayTimings.map((timing, index) => {
                  const quality = getChoghadiyaQuality(timing.type);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border hover-elevate"
                      data-testid={`timing-day-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${getChoghadiyaColor(timing.type)} flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold" data-testid={`text-day-type-${index}`}>{timing.type}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`text-day-time-${index}`}>{timing.start} - {timing.end}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={quality === "excellent" || quality === "good" ? "default" : "destructive"}
                        data-testid={`badge-day-quality-${index}`}
                      >
                        {quality === "excellent" ? "Excellent" : quality === "good" ? "Good" : "Avoid"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Night Choghadiya */}
          <Card className="hover-elevate" data-testid="card-night-timings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-night-title">
                <Moon className="h-5 w-5 text-purple-500" />
                Night Choghadiya
              </CardTitle>
              <CardDescription data-testid="text-night-period">Sunset to Sunrise (06:00 PM - 06:00 AM)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nightTimings.map((timing, index) => {
                  const quality = getChoghadiyaQuality(timing.type);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border hover-elevate"
                      data-testid={`timing-night-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${getChoghadiyaColor(timing.type)} flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold" data-testid={`text-night-type-${index}`}>{timing.type}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`text-night-time-${index}`}>{timing.start} - {timing.end}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={quality === "excellent" || quality === "good" ? "default" : "destructive"}
                        data-testid={`badge-night-quality-${index}`}
                      >
                        {quality === "excellent" ? "Excellent" : quality === "good" ? "Good" : "Avoid"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Tabs */}
        <Tabs defaultValue="types" className="mb-8" data-testid="tabs-choghadiya-info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="types" data-testid="tab-types">Choghadiya Types</TabsTrigger>
            <TabsTrigger value="usage" data-testid="tab-usage">How to Use</TabsTrigger>
            <TabsTrigger value="importance" data-testid="tab-importance">Significance</TabsTrigger>
          </TabsList>

          {/* Types Tab */}
          <TabsContent value="types" className="space-y-6 mt-6" data-testid="content-types">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-types-title">8 Types of Choghadiya</CardTitle>
                <CardDescription data-testid="text-types-description">
                  Understanding each time period and its characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {choghadiyaTypes.map((chog, index) => (
                    <Card
                      key={index}
                      className={`hover-elevate border-2 ${chog.quality === "excellent" || chog.quality === "good" ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}
                      data-testid={`card-type-${chog.name.toLowerCase()}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`h-12 w-12 rounded-full ${chog.color} flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <Badge 
                            variant={chog.quality === "excellent" || chog.quality === "good" ? "default" : "destructive"}
                            data-testid={`badge-type-quality-${chog.name.toLowerCase()}`}
                          >
                            {chog.quality === "excellent" ? "Excellent" : chog.quality === "good" ? "Good" : "Inauspicious"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg" data-testid={`text-type-name-${chog.name.toLowerCase()}`}>
                          {chog.name} ({chog.hindi})
                        </CardTitle>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-muted-foreground" data-testid={`text-type-meaning-${chog.name.toLowerCase()}`}>
                            Meaning: {chog.meaning}
                          </p>
                          <p className="text-sm font-semibold text-primary" data-testid={`text-type-planet-${chog.name.toLowerCase()}`}>
                            Ruled by: {chog.planet}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm" data-testid={`text-type-description-${chog.name.toLowerCase()}`}>
                          {chog.description}
                        </p>
                        
                        {chog.suitable.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400" data-testid={`text-suitable-title-${chog.name.toLowerCase()}`}>
                              ✓ Suitable For:
                            </h4>
                            <ul className="text-xs text-muted-foreground space-y-1" data-testid={`list-suitable-${chog.name.toLowerCase()}`}>
                              {chog.suitable.map((activity, i) => (
                                <li key={i}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {chog.avoid.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-red-700 dark:text-red-400" data-testid={`text-avoid-title-${chog.name.toLowerCase()}`}>
                              ✗ Avoid:
                            </h4>
                            <ul className="text-xs text-muted-foreground space-y-1" data-testid={`list-avoid-${chog.name.toLowerCase()}`}>
                              {chog.avoid.map((activity, i) => (
                                <li key={i}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6 mt-6" data-testid="content-usage">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle data-testid="text-usage-title">How to Use Choghadiya</CardTitle>
                <CardDescription data-testid="text-usage-description">
                  Practical guide to applying Choghadiya in daily life
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" data-testid="text-step1-title">Check Current Choghadiya</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-step1-description">
                        Look at the current time and identify which Choghadiya period you're in. Day and night Choghadiya follow different sequences.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" data-testid="text-step2-title">Match with Your Activity</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-step2-description">
                        Determine the nature of your planned activity and check if it aligns with the current Choghadiya quality.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" data-testid="text-step3-title">Plan Important Activities</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-step3-description">
                        Schedule crucial tasks during Amrit, Shubh, or Labh periods. For urgent matters, use Char if favorable periods aren't available.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" data-testid="text-step4-title">Avoid Inauspicious Times</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-step4-description">
                        Refrain from starting new ventures, signing contracts, or performing ceremonies during Udveg, Kal, Rog, or Kaal Ratri.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-900" data-testid="card-quick-reference">
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="text-quick-ref-title">
                    <Star className="h-4 w-4 text-blue-600" />
                    Quick Reference Guide
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2" data-testid="text-best-for">Best For Important Work:</h4>
                      <ul className="space-y-1 text-muted-foreground" data-testid="list-best-periods">
                        <li>• Amrit (Most auspicious)</li>
                        <li>• Shubh (Highly favorable)</li>
                        <li>• Labh (Profit-oriented)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2" data-testid="text-avoid-periods">Avoid These Times:</h4>
                      <ul className="space-y-1 text-muted-foreground" data-testid="list-avoid-periods">
                        <li>• Kal (Death - most inauspicious)</li>
                        <li>• Rog (Disease)</li>
                        <li>• Kaal Ratri (Dark night)</li>
                        <li>• Udveg (Anxiety)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Importance Tab */}
          <TabsContent value="importance" className="space-y-6 mt-6" data-testid="content-importance">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle data-testid="text-importance-title">Significance of Choghadiya</CardTitle>
                <CardDescription data-testid="text-importance-description">
                  Why Choghadiya matters in Vedic tradition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h3 className="text-lg font-semibold" data-testid="text-ancient-wisdom">Ancient Vedic Wisdom</h3>
                  <p className="text-muted-foreground" data-testid="text-wisdom-description">
                    Choghadiya is an ancient Vedic time measurement system that divides each day and night into 8 periods of approximately 90 minutes each. The word "Choghadiya" comes from "Chau" (four) and "Ghadiya" (a unit of time equal to 24 minutes), making each Choghadiya period about 96 minutes long.
                  </p>

                  <h3 className="text-lg font-semibold mt-6" data-testid="text-practical-astrology">Practical Astrology</h3>
                  <p className="text-muted-foreground" data-testid="text-practical-description">
                    Unlike complex Panchang calculations, Choghadiya provides a simple yet effective way to determine auspicious timings for daily activities. It's especially popular among business communities in Gujarat and Rajasthan for making important decisions.
                  </p>

                  <h3 className="text-lg font-semibold mt-6" data-testid="text-planetary-influence">Planetary Influences</h3>
                  <p className="text-muted-foreground" data-testid="text-planetary-description">
                    Each Choghadiya period is governed by a different planet, influencing the energies available during that time:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mt-3" data-testid="list-planetary-influences">
                    <li><strong>Moon (Amrit):</strong> Most auspicious, nectar-like period - excellent for all activities</li>
                    <li><strong>Jupiter (Shubh):</strong> Highly auspicious for ceremonies and positive ventures</li>
                    <li><strong>Mercury (Labh):</strong> Brings profit and business success</li>
                    <li><strong>Venus (Char):</strong> Favorable for movement, travel, and dynamic activities</li>
                    <li><strong>Sun (Udveg):</strong> Creates obstacles, anxiety, and mental disturbance</li>
                    <li><strong>Saturn (Kal):</strong> Brings delays, difficulties, and destruction</li>
                    <li><strong>Mars (Rog):</strong> Can cause health issues, conflicts, and negative outcomes</li>
                    <li><strong>Rahu (Kaal Ratri):</strong> Most inauspicious shadow planet - avoid all activities</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6" data-testid="text-modern-relevance">Modern Relevance</h3>
                  <p className="text-muted-foreground" data-testid="text-modern-description">
                    In today's fast-paced world, Choghadiya offers a practical framework for timing important activities without requiring extensive astrological knowledge. Many successful entrepreneurs and business people consult Choghadiya before:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-3" data-testid="list-modern-uses">
                    <li>• Opening new businesses or shops</li>
                    <li>• Starting journeys or relocations</li>
                    <li>• Signing important contracts</li>
                    <li>• Making investments or large purchases</li>
                    <li>• Beginning new projects or ventures</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-900" data-testid="card-important-note">
                  <h3 className="font-semibold mb-2 flex items-center gap-2" data-testid="text-note-title">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Important Note
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-note-content">
                    While Choghadiya is a valuable tool for timing, it should be combined with other Panchang elements like Tithi, Nakshatra, and Yoga for major life events. For critical decisions such as marriage, property purchase, or medical procedures, consulting an experienced astrologer is recommended.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800" data-testid="card-cta">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold text-xl mb-2">Need Personalized Timing Guidance?</h3>
                <p className="text-muted-foreground">
                  Get customized muhurat recommendations based on your birth chart and specific requirements. Our expert astrologers will help you choose the perfect timing for your important events.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-book-consultation"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button 
                  variant="outline"
                  data-testid="button-view-muhurat"
                  onClick={() => window.location.href = '/muhurat'}
                >
                  View Muhurat Finder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

