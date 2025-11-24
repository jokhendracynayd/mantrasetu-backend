import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Sunrise,
  Sunset,
  Moon,
  Star,
  Clock,
  Info,
  Sparkles,
  Shield,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  MapPin,
  RefreshCw,
} from "lucide-react";

// Mock data - in production, this would come from an API
const todayDate = new Date();
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const panchangData = {
  gregorianDate: formatDate(todayDate),
  hindiDate: "Ashwin Krishna Paksha Chaturthi",
  vikramSamvat: "2082",
  shakaSamvat: "1947",
  kaliSamvat: "5126",

  // Five elements of Panchang
  tithi: {
    name: "Chaturthi (4th Lunar Day)",
    paksha: "Krishna Paksha (Waning Phase)",
    endTime: "06:42 AM, Oct 23",
    deity: "Lord Ganesha",
    significance: "Good for removing obstacles, seeking wisdom",
    auspicious: true,
  },

  nakshatra: {
    name: "Hasta",
    lord: "Moon",
    endTime: "08:15 PM",
    deity: "Savitar (Sun God)",
    characteristics: "Intelligence, craftsmanship, healing",
    auspicious: true,
  },

  yoga: {
    name: "Shiva",
    endTime: "02:30 PM",
    deity: "Lord Shiva",
    effect: "Auspicious for spiritual practices and meditation",
    auspicious: true,
  },

  karana: {
    name: "Vanija",
    type: "Movable",
    endTime: "05:20 PM",
    effect: "Good for business and trade activities",
    auspicious: true,
  },

  vara: {
    name: "Tuesday (Mangalvaar)",
    lord: "Mars (Mangal)",
    color: "Red",
    deity: "Lord Hanuman & Kartikeya",
    favorable: ["Exercise", "Courage-building", "Property matters"],
  },

  // Sun and Moon timings
  timings: {
    sunrise: "06:28 AM",
    sunset: "06:02 PM",
    moonrise: "10:45 PM",
    moonset: "12:20 PM",
    dayDuration: "11h 34m",
  },

  // Inauspicious periods
  inauspicious: [
    {
      name: "Rahu Kaal",
      time: "03:15 PM - 04:45 PM",
      description: "Avoid starting new ventures during this period",
      severity: "high",
    },
    {
      name: "Yamagandam",
      time: "09:00 AM - 10:30 AM",
      description: "Inauspicious for important activities",
      severity: "medium",
    },
    {
      name: "Gulika Kaal",
      time: "12:00 PM - 01:30 PM",
      description: "Not favorable for auspicious work",
      severity: "medium",
    },
  ],

  // Auspicious periods
  auspicious: [
    {
      name: "Abhijit Muhurat",
      time: "11:48 AM - 12:36 PM",
      description: "Most auspicious time for any important work",
      activity: "All auspicious activities",
    },
    {
      name: "Amrit Kaal",
      time: "07:30 AM - 09:05 AM",
      description: "Highly favorable for spiritual practices",
      activity: "Puja, meditation, learning",
    },
  ],

  // Festivals and special days
  festivals: [
    {
      name: "Regular Day",
      description: "No major festival today",
      type: "normal",
    },
  ],

  // Recommendations
  recommendations: {
    favorable: [
      "Worship Lord Ganesha on Chaturthi",
      "Start new learning or skill development",
      "Hanuman puja is highly beneficial on Tuesday",
      "Business meetings and trade activities",
      "Health and fitness activities",
    ],
    avoid: [
      "Marriage ceremonies (not ideal day)",
      "Starting major construction work",
      "Long-distance travel during Rahu Kaal",
      "Important decisions during inauspicious periods",
    ],
  },
};

export default function Panchang() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Calendar className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">
                Today's Hindu Calendar
              </span>
            </div>

            <h1
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
              data-testid="text-page-title"
            >
              Panchang
            </h1>

            <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
              Complete Hindu calendar with precise timings, auspicious periods,
              and spiritual guidance for {formatDate(todayDate)}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Updated in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Date Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Gregorian Calendar
              </CardDescription>
              <CardTitle className="text-lg">
                {panchangData.gregorianDate}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Hindu Calendar
              </CardDescription>
              <CardTitle className="text-lg">
                {panchangData.hindiDate}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Vikram Samvat
              </CardDescription>
              <CardTitle className="text-lg">
                {panchangData.vikramSamvat}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Shaka Samvat
              </CardDescription>
              <CardTitle className="text-lg">
                {panchangData.shakaSamvat}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Sun & Moon Timings */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sunrise className="h-5 w-5 text-orange-500" />
              Celestial Timings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Sunrise className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Sunrise</p>
                <p className="font-semibold text-lg">
                  {panchangData.timings.sunrise}
                </p>
              </div>
              <div className="text-center">
                <Sunset className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Sunset</p>
                <p className="font-semibold text-lg">
                  {panchangData.timings.sunset}
                </p>
              </div>
              <div className="text-center">
                <Moon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Moonrise</p>
                <p className="font-semibold text-lg">
                  {panchangData.timings.moonrise}
                </p>
              </div>
              <div className="text-center">
                <Moon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Moonset</p>
                <p className="font-semibold text-lg">
                  {panchangData.timings.moonset}
                </p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Day Length</p>
                <p className="font-semibold text-lg">
                  {panchangData.timings.dayDuration}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="panchang" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="panchang" data-testid="tab-panchang">
              Five Elements
            </TabsTrigger>
            <TabsTrigger value="muhurat" data-testid="tab-muhurat">
              Timings
            </TabsTrigger>
            <TabsTrigger value="guide" data-testid="tab-guide">
              Daily Guide
            </TabsTrigger>
          </TabsList>

          {/* Five Elements Tab */}
          <TabsContent value="panchang" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tithi */}
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Moon className="h-5 w-5 text-blue-500" />
                        Tithi (Lunar Day)
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {panchangData.tithi.name}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        panchangData.tithi.auspicious
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {panchangData.tithi.auspicious
                        ? "Auspicious"
                        : "Inauspicious"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phase</p>
                      <p className="font-medium">{panchangData.tithi.paksha}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ends At</p>
                      <p className="font-medium">
                        {panchangData.tithi.endTime}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deity</p>
                    <p className="font-medium">{panchangData.tithi.deity}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <Info className="h-4 w-4 inline mr-1" />
                      {panchangData.tithi.significance}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Nakshatra */}
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Nakshatra (Constellation)
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {panchangData.nakshatra.name}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        panchangData.nakshatra.auspicious
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {panchangData.nakshatra.auspicious
                        ? "Favorable"
                        : "Unfavorable"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Lord</p>
                      <p className="font-medium">
                        {panchangData.nakshatra.lord}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ends At</p>
                      <p className="font-medium">
                        {panchangData.nakshatra.endTime}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deity</p>
                    <p className="font-medium">
                      {panchangData.nakshatra.deity}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
                    <p className="text-sm text-yellow-900 dark:text-yellow-300">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      {panchangData.nakshatra.characteristics}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Yoga */}
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        Yoga (Luni-Solar Day)
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {panchangData.yoga.name}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        panchangData.yoga.auspicious
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {panchangData.yoga.auspicious
                        ? "Beneficial"
                        : "Challenging"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deity</p>
                      <p className="font-medium">{panchangData.yoga.deity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ends At</p>
                      <p className="font-medium">{panchangData.yoga.endTime}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-md">
                    <p className="text-sm text-purple-900 dark:text-purple-300">
                      {panchangData.yoga.effect}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Karana */}
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        Karana (Half Lunar Day)
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {panchangData.karana.name}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {panchangData.karana.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{panchangData.karana.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ends At</p>
                      <p className="font-medium">
                        {panchangData.karana.endTime}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-md">
                    <p className="text-sm text-orange-900 dark:text-orange-300">
                      {panchangData.karana.effect}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vara (Weekday) */}
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  Vara (Weekday) - {panchangData.vara.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Ruling Planet
                    </p>
                    <p className="font-semibold">{panchangData.vara.lord}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Auspicious Color
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <p className="font-semibold">{panchangData.vara.color}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deity</p>
                    <p className="font-semibold">{panchangData.vara.deity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Favorable For
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {panchangData.vara.favorable.map((activity, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timings Tab */}
          <TabsContent value="muhurat" className="space-y-6 mt-6">
            {/* Auspicious Periods */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Sparkles className="h-5 w-5" />
                  Auspicious Muhurat (Shubh Muhurat)
                </CardTitle>
                <CardDescription>
                  Most favorable time periods for important activities and
                  ceremonies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {panchangData.auspicious.map((period, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-300">
                          {period.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {period.description}
                        </p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {period.time}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        Best For:{" "}
                      </span>
                      <span className="text-sm font-medium">
                        {period.activity}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Inauspicious Periods */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Inauspicious Periods (Avoid Important Work)
                </CardTitle>
                <CardDescription>
                  Time periods to avoid for starting new ventures and important
                  activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {panchangData.inauspicious.map((period, idx) => (
                  <div
                    key={idx}
                    className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-300">
                          {period.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {period.description}
                        </p>
                      </div>
                      <Badge variant="destructive">{period.time}</Badge>
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={
                          period.severity === "high"
                            ? "border-red-500 text-red-700 dark:text-red-400"
                            : "border-orange-500 text-orange-700 dark:text-orange-400"
                        }
                      >
                        {period.severity === "high"
                          ? "High Priority Avoid"
                          : "Moderate Avoid"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Guide Tab */}
          <TabsContent value="guide" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Shield className="h-5 w-5" />
                    Recommended Activities
                  </CardTitle>
                  <CardDescription>
                    Activities that are favorable today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {panchangData.recommendations.favorable.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Don'ts */}
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Activities to Avoid
                  </CardTitle>
                  <CardDescription>Not recommended for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {panchangData.recommendations.avoid.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Educational Content */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Understanding Panchang
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Panchang, derived from Sanskrit "Panch" (five) and "Anga"
                  (limbs), is the Hindu Vedic calendar system that helps
                  determine auspicious and inauspicious times for various
                  activities. It combines five astronomical elements to provide
                  comprehensive daily guidance.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      Ancient Wisdom
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Used for thousands of years to align human activities with
                      cosmic energies and natural rhythms.
                    </p>
                  </div>

                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Modern Relevance
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Still widely used for planning weddings, starting
                      businesses, religious ceremonies, and daily life
                      decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Panchang
          </Button>
          <Button data-testid="button-personalized">
            <Calendar className="h-4 w-4 mr-2" />
            Get Personalized Muhurat
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              <Info className="h-4 w-4 inline mr-1" />
              This Panchang is calculated for New Delhi, India. Times may vary
              based on your location. For personalized consultation and precise
              muhurat calculation, please consult with our expert pandits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
