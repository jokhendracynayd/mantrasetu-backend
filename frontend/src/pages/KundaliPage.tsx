import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Star, 
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  BookOpen,
  Download,
  Eye,
  FileText,
  Shield,
  Heart,
  TrendingUp,
  Compass,
  Zap,
  Info
} from "lucide-react";

const chartStyles = [
  { id: "north", name: "North Indian", description: "Diamond shaped chart" },
  { id: "south", name: "South Indian", description: "Square grid chart" },
  { id: "east", name: "East Indian", description: "Rectangular chart" },
];

const kundaliFeatures = [
  {
    icon: Compass,
    title: "Lagna Chart",
    description: "Your ascendant and birth chart showing planetary positions",
    color: "text-orange-600"
  },
  {
    icon: Star,
    title: "Rashi & Navamsa",
    description: "Moon chart and divisional charts for deeper insights",
    color: "text-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Dasha Periods",
    description: "Vimshottari Dasha timeline showing planetary periods",
    color: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Dosha Analysis",
    description: "Mangal Dosha, Kaal Sarp Dosha, and Sade Sati check",
    color: "text-red-600"
  },
  {
    icon: Heart,
    title: "Life Predictions",
    description: "Career, marriage, health, and wealth analysis",
    color: "text-pink-600"
  },
  {
    icon: Sparkles,
    title: "Remedies & Gemstones",
    description: "Personalized recommendations for planetary balance",
    color: "text-green-600"
  },
];

// Zod validation schema
const kundaliFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  day: z.string().min(1, "Please select day"),
  month: z.string().min(1, "Please select month"),
  year: z.string().min(1, "Please select year"),
  hour: z.string().min(1, "Please select hour"),
  minute: z.string().min(1, "Please select minute"),
  city: z.string().min(2, "Please enter your birth city").max(100, "City name is too long"),
  chartStyle: z.enum(["north", "south", "east"], {
    required_error: "Please select a chart style",
  }),
});

type KundaliFormData = z.infer<typeof kundaliFormSchema>;

export default function KundaliPage() {
  const form = useForm<KundaliFormData>({
    resolver: zodResolver(kundaliFormSchema),
    defaultValues: {
      name: "",
      gender: "male",
      day: "",
      month: "",
      year: "",
      hour: "",
      minute: "",
      city: "",
      chartStyle: "north"
    },
  });

  const onSubmit = (data: KundaliFormData) => {
    console.log("Creating Kundali with data:", data);
    // TODO: API integration for Kundali generation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-900 dark:via-red-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Vedic Birth Chart Generator</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-page-title">
              Create Your Kundali
            </h1>
            
            <p className="text-xl text-orange-100 mb-6 max-w-3xl mx-auto">
              Generate your detailed Janam Kundali (Birth Chart) based on Vedic astrology with complete planetary analysis, predictions, and remedies
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Detailed PDF Report</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>50+ Page Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-orange-600" />
                  Birth Details
                </CardTitle>
                <CardDescription>
                  Enter accurate birth information for precise Kundali calculation. Even 2-4 minutes difference can change your Ascendant (Lagna)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  data-testid="input-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Gender *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth *
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="day"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-day">
                                    <SelectValue placeholder="DD" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(31)].map((_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="month"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Month</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-month">
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-year">
                                    <SelectValue placeholder="YYYY" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(100)].map((_, i) => {
                                    const year = 2025 - i;
                                    return (
                                      <SelectItem key={year} value={String(year)}>
                                        {year}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Time of Birth */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time of Birth *
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="hour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hour (24-hour)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-hour">
                                    <SelectValue placeholder="HH" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(24)].map((_, i) => (
                                    <SelectItem key={i} value={String(i).padStart(2, '0')}>
                                      {String(i).padStart(2, '0')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="minute"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minute</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-minute">
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(60)].map((_, i) => (
                                    <SelectItem key={i} value={String(i).padStart(2, '0')}>
                                      {String(i).padStart(2, '0')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormDescription className="flex items-start gap-2">
                        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>Exact birth time is crucial. Check your birth certificate or hospital records for accurate time.</span>
                      </FormDescription>
                    </div>

                    {/* Place of Birth */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Place of Birth *
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City/Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Mumbai, India"
                                {...field}
                                data-testid="input-city"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the city where you were born. We'll calculate geographic coordinates automatically.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Chart Style */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Compass className="h-4 w-4" />
                        Chart Style
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="chartStyle"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid md:grid-cols-3 gap-4"
                              >
                                {chartStyles.map((style) => (
                                  <div key={style.id} className="relative">
                                    <RadioGroupItem
                                      value={style.id}
                                      id={style.id}
                                      className="peer sr-only"
                                      data-testid={`radio-chart-${style.id}`}
                                    />
                                    <Label
                                      htmlFor={style.id}
                                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-900/20"
                                    >
                                      <span className="font-semibold">{style.name}</span>
                                      <span className="text-xs text-muted-foreground text-center mt-1">
                                        {style.description}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                        data-testid="button-generate"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate My Kundali
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Your Kundali will be generated instantly with a detailed PDF report
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Features & Info */}
          <div className="space-y-6">
            {/* What's Included */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kundaliFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                      <Icon className={`h-5 w-5 ${feature.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sample Chart Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-orange-600" />
                  Sample Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg flex items-center justify-center border-2 border-orange-200 dark:border-orange-800">
                  <div className="text-center p-6">
                    <Compass className="h-16 w-16 text-orange-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Your personalized birth chart will appear here with planetary positions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Consultation */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Need Expert Analysis?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get your Kundali interpreted by experienced Vedic astrologers
                  </p>
                  <Button variant="outline" className="w-full" data-testid="button-consult">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about" data-testid="tab-about">About Kundali</TabsTrigger>
              <TabsTrigger value="importance" data-testid="tab-importance">Why It Matters</TabsTrigger>
              <TabsTrigger value="faq" data-testid="tab-faq">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    What is a Kundali?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    A Kundali (also called Janam Kundali or Birth Chart) is a detailed astrological chart created based on the exact date, time, 
                    and place of your birth. In Vedic astrology, it's considered a cosmic blueprint of your life, showing the positions of planets, 
                    stars, and celestial bodies at the moment of your birth.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        12 Houses
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Each house represents different aspects of life - personality, wealth, siblings, home, education, career, marriage, 
                        longevity, fortune, profession, gains, and losses.
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-orange-600" />
                        9 Planets
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu (North Node), and Ketu (South Node) - each influencing 
                        different life areas.
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-orange-600" />
                        12 Rashis
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The 12 zodiac signs (Mesh to Meen) that the planets occupy, each with unique characteristics and ruling deities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="importance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Why is Kundali Important?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Your Kundali serves as a spiritual and practical guide throughout your life. Here's why it matters:
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      {
                        title: "Life Path Guidance",
                        description: "Understand your strengths, weaknesses, and life purpose based on planetary positions."
                      },
                      {
                        title: "Career Direction",
                        description: "Identify the most suitable career paths and business ventures aligned with your chart."
                      },
                      {
                        title: "Relationship Compatibility",
                        description: "Used in Kundali matching for marriage to assess compatibility between partners."
                      },
                      {
                        title: "Timing of Events",
                        description: "Dasha periods help predict favorable and challenging times for important decisions."
                      },
                      {
                        title: "Health Insights",
                        description: "Identify potential health challenges and take preventive measures early."
                      },
                      {
                        title: "Remedial Measures",
                        description: "Get personalized gemstone, mantra, and ritual recommendations to balance planetary energies."
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                        <Badge variant="secondary" className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-orange-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      q: "What if I don't know my exact birth time?",
                      a: "Birth time is crucial for accurate Kundali. Check your birth certificate, hospital records, or ask family members. If unavailable, approximate time can give partial insights, but Ascendant (Lagna) calculation will be affected."
                    },
                    {
                      q: "Which chart style should I choose?",
                      a: "North Indian style is most common in North India and Nepal. South Indian is popular in South India and Sri Lanka. East Indian is used in Bengal and Odisha. All contain the same information, just displayed differently. Choose based on your regional preference."
                    },
                    {
                      q: "How is Vedic Kundali different from Western astrology?",
                      a: "Vedic astrology uses the sidereal zodiac (actual constellation positions) and emphasizes Moon sign. Western astrology uses tropical zodiac (seasonal) and focuses on Sun sign. Vedic includes Nakshatras, Dashas, and different house systems."
                    },
                    {
                      q: "Can Kundali predict the future?",
                      a: "Kundali shows tendencies, potential, and timing of events based on planetary cycles. It's a guide for making informed decisions and understanding life patterns, not fixed predictions. Free will plays an important role."
                    },
                    {
                      q: "What are doshas and should I worry about them?",
                      a: "Doshas like Mangal Dosha or Kaal Sarp Dosha are specific planetary combinations that may create challenges in certain life areas. Most doshas have remedies through mantras, gemstones, or rituals. Consult an astrologer for personalized guidance."
                    },
                  ].map((faq, index) => (
                    <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <h4 className="font-semibold mb-2">{faq.q}</h4>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

