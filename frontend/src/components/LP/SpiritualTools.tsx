import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import toolsImage from "@assets/stock_Images/Traditional_spiritual_astrology_tools_27c646aa.webp";
import panchangImage from "@assets/stock_Images/Panchang_calendar_circular_icon_63796759.webp";
import muhuratImage from "@assets/stock_Images/Muhurat_finder_timing_wheel_5474c405.webp";
import rashifalImage from "@assets/stock_Images/Rashifal_horoscope_chart_wheel_79306805.webp";
import kundaliImage from "@assets/stock_Images/Kundali_birth_chart_circular_46817752.webp";
import gemstoneImage from "@assets/stock_Images/Gemstone_guide_circular_arrangement_5d7777b8.webp";
import choghadiyaImage from "@assets/stock_Images/Choghadiya_time_wheel_circular_efad4c47.webp";
import { useNavigate } from "react-router-dom";


const tools = [
  {
    title: "Panchang",
    description: "Complete Hindu calendar with tithis, nakshatras, and festivals",
    action: "View Today's Panchang",
    image: panchangImage,
    isAvailable: true
  },
  {
    title: "Muhurat Finder",
    description: "Find auspicious timings for important events and ceremonies",
    action: "Find Muhurat",
    image: muhuratImage,
    isAvailable: true
  },
  {
    title: "Rashifal",
    description: "Daily, weekly, and monthly horoscope predictions",
    action: "Check Horoscope",
    image: rashifalImage,
    isAvailable: true
  },
  {
    title: "Kundali Creation",
    description: "Generate accurate birth charts using Vedic astrology",
    action: "Create Kundali",
    image: kundaliImage,
    isAvailable: true
  },
  {
    title: "Gemstone Guide",
    description: "Personalized gemstone recommendations for well-being",
    action: "Get Recommendations",
    image: gemstoneImage,
    isAvailable: true
  },
  {
    title: "Choghadiya",
    description: "Auspicious and inauspicious time periods for daily activities",
    action: "View Timings",
    image: choghadiyaImage,
    isAvailable: true
  }
];

//todo: remove mock functionality
const mockTimeData = {
  currentTime: "14:30 IST",
  todayTithi: "Panchami",
  nakshatra: "Rohini",
  muhurat: "Abhijit (11:48 - 12:36)"
};


export default function SpiritualTools() {
  const navigate = useNavigate();

  const handleToolClick = (toolTitle: string) => {
    if (toolTitle === "Panchang") {
      navigate("/panchang");
    } else if (toolTitle === "Muhurat Finder") {
      navigate("/muhurat");
    } else if (toolTitle === "Rashifal") {
      navigate("/rashifal");
    } else if (toolTitle === "Kundali Creation") {
      navigate("/kundali");
    } else if (toolTitle === "Gemstone Guide") {
      navigate("/gemstone-guide");
    } else if (toolTitle === "Choghadiya") {
      navigate("/choghadiya");
    } else {
      console.log(`${toolTitle} tool clicked`);
      // TODO: remove mock functionality - replace with actual tool functionality
    }
  };
  return (
    <section id="tools" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Spiritual Tools & Guidance
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access authentic Vedic astrology tools, daily guidance, and spiritual insights 
              to align your life with cosmic rhythms and sacred timings.
            </p>
            
            {/* Current Status Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Today's Spiritual Timings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Time:</span>
                    <p className="font-semibold">{mockTimeData.currentTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Today's Tithi:</span>
                    <p className="font-semibold">{mockTimeData.todayTithi}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nakshatra:</span>
                    <p className="font-semibold">{mockTimeData.nakshatra}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Abhijit Muhurat:</span>
                    <p className="font-semibold">{mockTimeData.muhurat}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:order-first">
            <img 
              src={toolsImage} 
              alt="Traditional spiritual and astrology tools"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.title} 
              className={`h-full flex flex-col relative ${
                tool.isAvailable
                  ? "hover-elevate cursor-pointer group"
                  : "opacity-75"
              }`}
              onClick={() => tool.isAvailable && handleToolClick(tool.title)}
              data-testid={`card-tool-${tool.title.toLowerCase().replace(' ', '-')}`}
            >
              {/* Launching Soon Ribbon */}
              {!tool.isAvailable && (
                <div className="absolute top-2 right-0 z-10">
                  <div className="relative">
                    {/* Main ribbon */}
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-xs font-bold px-6 py-2 shadow-xl transform rotate-12 hover:rotate-6 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">🚀</span>
                        <span className="font-extrabold tracking-wide">LAUNCHING SOON</span>
                      </div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12"></div>
                    </div>
                    {/* Ribbon tail */}
                    <div className="absolute -bottom-1 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-red-600 transform rotate-12"></div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 blur-sm opacity-60 transform rotate-12 -z-10"></div>
                  </div>
                </div>
              )}
              <CardHeader className="text-center space-y-4 flex-shrink-0">
                <div className="w-16 h-16 mx-auto">
                  <img 
                    src={tool.image} 
                    alt={tool.title}
                    className={`w-full h-full object-cover rounded-full border-2 border-primary/20 ${
                      tool.isAvailable ? "group-hover:scale-105 transition-transform duration-300" : ""
                    }`}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription className="mt-2 flex-grow">
                    {tool.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex-grow flex flex-col">
                <Button 
                  variant={tool.isAvailable ? "outline" : "secondary"}
                  className={`w-full mt-auto ${
                    tool.isAvailable ? "group" : "cursor-not-allowed opacity-75"
                  }`}
                  disabled={!tool.isAvailable}
                  data-testid={`button-${tool.title.toLowerCase().replace(' ', '-')}`}
                >
                  {tool.isAvailable ? (
                    <>
                      {tool.action}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    "Launching Soon"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}