import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock,
  Heart,
  Home,
  Briefcase,
  Car,
  Baby,
  GraduationCap,
  Sparkles,
  Star,
  MapPin,
  Search,
  Info,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Zap
} from "lucide-react";

const ceremonyTypes = [
  { value: "marriage", label: "Marriage / Wedding", icon: Heart, color: "text-pink-500" },
  { value: "griha-pravesh", label: "Griha Pravesh (Housewarming)", icon: Home, color: "text-blue-500" },
  { value: "business", label: "New Business / Shop Opening", icon: Briefcase, color: "text-green-500" },
  { value: "vehicle", label: "Vehicle Purchase", icon: Car, color: "text-purple-500" },
  { value: "namkaran", label: "Namkaran (Naming Ceremony)", icon: Baby, color: "text-orange-500" },
  { value: "education", label: "Education / Vidyarambham", icon: GraduationCap, color: "text-indigo-500" },
];

// Mock upcoming auspicious dates
const upcomingMuhurats = {
  marriage: [
    { date: "November 25, 2025", day: "Tuesday", time: "10:30 AM - 12:15 PM", nakshatra: "Rohini", quality: "Excellent" },
    { date: "November 28, 2025", day: "Friday", time: "09:45 AM - 11:30 AM", nakshatra: "Uttara Phalguni", quality: "Very Good" },
    { date: "December 5, 2025", day: "Friday", time: "11:00 AM - 01:00 PM", nakshatra: "Hasta", quality: "Excellent" },
  ],
  "griha-pravesh": [
    { date: "November 3, 2025", day: "Monday", time: "07:30 AM - 09:15 AM", nakshatra: "Revati", quality: "Excellent" },
    { date: "November 10, 2025", day: "Monday", time: "08:00 AM - 10:00 AM", nakshatra: "Ashwini", quality: "Very Good" },
    { date: "November 17, 2025", day: "Monday", time: "09:30 AM - 11:15 AM", nakshatra: "Mrigashira", quality: "Good" },
  ],
  business: [
    { date: "October 30, 2025", day: "Thursday", time: "10:15 AM - 12:00 PM", nakshatra: "Pushya", quality: "Excellent" },
    { date: "November 6, 2025", day: "Thursday", time: "11:00 AM - 12:45 PM", nakshatra: "Uttara Phalguni", quality: "Very Good" },
    { date: "November 13, 2025", day: "Thursday", time: "09:30 AM - 11:15 AM", nakshatra: "Hasta", quality: "Excellent" },
  ],
  vehicle: [
    { date: "October 23, 2025", day: "Thursday", time: "11:45 AM - 01:30 PM", nakshatra: "Ashwini", quality: "Excellent" },
    { date: "October 27, 2025", day: "Monday", time: "10:00 AM - 11:45 AM", nakshatra: "Swati", quality: "Very Good" },
    { date: "November 3, 2025", day: "Monday", time: "09:15 AM - 11:00 AM", nakshatra: "Shravana", quality: "Excellent" },
  ],
  namkaran: [
    { date: "October 24, 2025", day: "Friday", time: "08:30 AM - 10:15 AM", nakshatra: "Pushya", quality: "Excellent" },
    { date: "October 31, 2025", day: "Friday", time: "09:00 AM - 10:45 AM", nakshatra: "Rohini", quality: "Very Good" },
    { date: "November 7, 2025", day: "Friday", time: "10:00 AM - 11:45 AM", nakshatra: "Ashwini", quality: "Excellent" },
  ],
  education: [
    { date: "October 29, 2025", day: "Wednesday", time: "08:45 AM - 10:30 AM", nakshatra: "Hasta", quality: "Excellent" },
    { date: "November 5, 2025", day: "Wednesday", time: "09:30 AM - 11:15 AM", nakshatra: "Revati", quality: "Very Good" },
    { date: "November 12, 2025", day: "Wednesday", time: "10:15 AM - 12:00 PM", nakshatra: "Swati", quality: "Good" },
  ],
};

const dailyMuhurats = [
  {
    name: "Abhijit Muhurat",
    time: "11:48 AM - 12:36 PM",
    description: "Most auspicious 48-minute window around noon, suitable for any important work",
    suitable: "All ceremonies and important activities"
  },
  {
    name: "Amrit Kaal",
    time: "07:30 AM - 09:05 AM",
    description: "Highly favorable nectar period for spiritual activities",
    suitable: "Puja, meditation, religious ceremonies"
  },
  {
    name: "Brahma Muhurat",
    time: "04:45 AM - 05:30 AM",
    description: "Sacred early morning period ideal for spiritual practices",
    suitable: "Yoga, meditation, study of scriptures"
  },
];

export default function MuhuratFinder() {
  const [selectedCeremony, setSelectedCeremony] = useState<string>("");
  const [location, setLocation] = useState<string>("New Delhi");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (selectedCeremony) {
      setShowResults(true);
    }
  };

  const getSelectedCeremonyData = () => {
    return ceremonyTypes.find(c => c.value === selectedCeremony);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Clock className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Auspicious Timing Calculator</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Muhurat Finder
            </h1>
            
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Find the most auspicious dates and timings for your important life events using authentic Vedic astrology
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Vedic Calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Expert Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location Specific</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Muhurat Finder Form */}
        <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="h-6 w-6 text-purple-600" />
              Find Your Perfect Muhurat
            </CardTitle>
            <CardDescription>
              Select the type of ceremony and location to get personalized auspicious timings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ceremony-type">Select Ceremony Type *</Label>
                <Select value={selectedCeremony} onValueChange={setSelectedCeremony}>
                  <SelectTrigger id="ceremony-type" data-testid="select-ceremony-type">
                    <SelectValue placeholder="Choose ceremony type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ceremonyTypes.map((ceremony) => {
                      const Icon = ceremony.icon;
                      return (
                        <SelectItem key={ceremony.value} value={ceremony.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${ceremony.color}`} />
                            <span>{ceremony.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city name"
                  data-testid="input-location"
                />
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={!selectedCeremony}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              data-testid="button-find-muhurat"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Auspicious Dates
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results" data-testid="tab-results">Upcoming Dates</TabsTrigger>
            <TabsTrigger value="daily" data-testid="tab-daily">Daily Muhurats</TabsTrigger>
            <TabsTrigger value="guide" data-testid="tab-guide">Muhurat Guide</TabsTrigger>
          </TabsList>
          
          {/* Results Tab */}
          <TabsContent value="results" className="mt-6">
            {showResults && selectedCeremony ? (
              <div className="space-y-6">
                {/* Selected Ceremony Info */}
                {getSelectedCeremonyData() && (
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {(() => {
                          const Icon = getSelectedCeremonyData()!.icon;
                          return <Icon className={`h-6 w-6 ${getSelectedCeremonyData()!.color}`} />;
                        })()}
                        Auspicious Dates for {getSelectedCeremonyData()!.label}
                      </CardTitle>
                      <CardDescription>
                        Calculated for {location} based on Vedic astrology and Panchang
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {/* Muhurat Cards */}
                <div className="grid gap-4">
                  {upcomingMuhurats[selectedCeremony as keyof typeof upcomingMuhurats]?.map((muhurat, idx) => (
                    <Card 
                      key={idx} 
                      className="hover-elevate border-l-4 border-l-purple-500"
                      data-testid={`card-muhurat-${idx}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                  {muhurat.date}
                                </h3>
                                <p className="text-sm text-muted-foreground">{muhurat.day}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 ml-15">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Muhurat Time</p>
                                <p className="font-medium flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-purple-500" />
                                  {muhurat.time}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Nakshatra</p>
                                <p className="font-medium flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  {muhurat.nakshatra}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <Badge 
                              className={
                                muhurat.quality === "Excellent" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                                  : muhurat.quality === "Very Good"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }
                            >
                              {muhurat.quality} Quality
                            </Badge>
                            <Button size="sm" variant="outline" data-testid={`button-book-${idx}`}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Pandit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Consultation CTA */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200 dark:border-orange-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-semibold text-lg mb-1">Need Personalized Muhurat?</h3>
                        <p className="text-sm text-muted-foreground">
                          Get a customized muhurat based on your horoscope and birth details from our expert pandits
                        </p>
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700" data-testid="button-consultation">
                        Get Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select a Ceremony to Begin</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose the type of ceremony from the form above to see upcoming auspicious dates and timings
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Daily Muhurats Tab */}
          <TabsContent value="daily" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Daily Auspicious Periods - Today
                </CardTitle>
                <CardDescription>
                  These special muhurats occur every day and can be used for various activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyMuhurats.map((muhurat, idx) => (
                    <div 
                      key={idx}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-purple-900 dark:text-purple-300">{muhurat.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{muhurat.description}</p>
                        </div>
                        <Badge className="bg-purple-600 text-white">
                          {muhurat.time}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                        <p className="text-xs text-muted-foreground">Best For:</p>
                        <p className="text-sm font-medium">{muhurat.suitable}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ceremony Quick Links */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {ceremonyTypes.slice(0, 3).map((ceremony) => {
                const Icon = ceremony.icon;
                return (
                  <Card 
                    key={ceremony.value}
                    className="hover-elevate cursor-pointer"
                    onClick={() => {
                      setSelectedCeremony(ceremony.value);
                      setShowResults(true);
                    }}
                    data-testid={`card-quick-${ceremony.value}`}
                  >
                    <CardContent className="pt-6 text-center">
                      <Icon className={`h-12 w-12 mx-auto mb-3 ${ceremony.color}`} />
                      <h4 className="font-semibold mb-1">{ceremony.label}</h4>
                      <p className="text-xs text-muted-foreground">Click to view dates</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Guide Tab */}
          <TabsContent value="guide" className="mt-6 space-y-6">
            {/* What is Muhurat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  What is Muhurat?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Muhurat (also spelled Muhurtam) is an auspicious time period calculated using Vedic astrology principles. 
                  It represents the most favorable moment to begin important activities, ensuring maximum success and minimum obstacles.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Based On Five Elements
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li>• Tithi (Lunar day)</li>
                      <li>• Nakshatra (Star constellation)</li>
                      <li>• Yoga (Luni-solar day)</li>
                      <li>• Karana (Half lunar day)</li>
                      <li>• Vara (Weekday)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Why Muhurat Matters
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <li>• Aligns with cosmic energies</li>
                      <li>• Ensures favorable planetary positions</li>
                      <li>• Maximizes chances of success</li>
                      <li>• Reduces obstacles and challenges</li>
                      <li>• Brings divine blessings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ceremony Types Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  Ceremony Types & Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ceremonyTypes.map((ceremony) => {
                    const Icon = ceremony.icon;
                    return (
                      <div key={ceremony.value} className="border-l-4 border-l-purple-300 dark:border-l-purple-700 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`h-5 w-5 ${ceremony.color}`} />
                          <h4 className="font-semibold">{ceremony.label}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ceremony.value === "marriage" && "Most important life event requiring comprehensive muhurat calculation. Avoid Chaturmas period and Pitru Paksha."}
                          {ceremony.value === "griha-pravesh" && "Entry into a new home. Best performed on auspicious nakshatras like Rohini, Uttara Phalguni, or Revati."}
                          {ceremony.value === "business" && "Start of new ventures. Thursday is particularly favorable with Pushya or Hasta nakshatra."}
                          {ceremony.value === "vehicle" && "Purchase of vehicles. Chara nakshatras like Ashwini, Swati, or Shravana are ideal."}
                          {ceremony.value === "namkaran" && "Baby naming ceremony. Performed on 10th, 11th, 12th, or 101st day after birth on auspicious tithi."}
                          {ceremony.value === "education" && "Beginning formal education. Auspicious during Vasant Panchami or on Wednesday with favorable nakshatra."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5" />
                  Important Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Muhurat timings are location-specific and vary based on geographical coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>For highly important events like marriage, consult an expert astrologer for personalized muhurat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Individual birth charts (horoscopes) can influence the ideal muhurat for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Avoid eclipse periods, Rahu Kaal, and other inauspicious times for important ceremonies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Book your pandit well in advance as auspicious dates tend to fill up quickly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
