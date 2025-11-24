import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, BookOpen, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import pujaImage from "@assets/stock_Images/Traditional_puja_ceremony_setup_7ebf9aaf.webp";
import ritualImage from "@assets/stock_Images/Sacred_ritual_ceremony_setup_aebce3f2.webp";
import libraryImage from "@assets/stock_Images/Spiritual_library_ancient_texts_b406bd90.webp";
import astrologyImage from "@assets/stock_Images/Astrology_tools_and_charts_9e6ee7f4.webp";

const journeyServices = [
  {
    icon: Calendar,
    title: "Book your first Puja",
    description:
      "Start your spiritual journey with a personalized puja ceremony",
    action: "Book Now",
    image: pujaImage,
    isAvailable: true,
  },
  {
    icon: Sparkles,
    title: "Book Sacred Ritual",
    description:
      "Experience traditional rituals performed by experienced Pandits",
    action: "Launching Soon",
    image: ritualImage,
    isAvailable: false,
  },
  {
    icon: BookOpen,
    title: "Explore Spiritual Library",
    description: "Access sacred texts, mantras, and spiritual wisdom",
    action: "Launching Soon",
    image: libraryImage,
    isAvailable: false,
  },
  {
    icon: Star,
    title: "Personalized Astrology Tools",
    description:
      "Get insights with customized astrology and spiritual guidance",
    action: "Launching Soon",
    image: astrologyImage,
    isAvailable: true,
  },
];

export default function SpiritualJourney() {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id="begin_your_spiritual_journey"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Begin Your Spiritual Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your first steps into a deeper spiritual practice with our
            guided services
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeyServices.map((service, index) => (
            <Card
              key={service.title}
              className={`text-center border-primary/20 h-full flex flex-col relative ${
                service.isAvailable
                  ? "hover-elevate cursor-pointer group"
                  : "opacity-75"
              }`}
              data-testid={`card-journey-${service.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {/* Launching Soon Ribbon */}
              {!service.isAvailable && (
                <div className="absolute top-2 right-0 z-10">
                  <div className="relative">
                    {/* Main ribbon */}
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-xs font-bold px-6 py-2 shadow-xl transform rotate-12 hover:rotate-6 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">🚀</span>
                        <span className="font-extrabold tracking-wide">
                          LAUNCHING SOON
                        </span>
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
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-grow flex flex-col">
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {service.description}
                </p>
                {service.isAvailable ? (
                  <Link
                    to="/services"
                    className="font-medium text-foreground hover:text-primary transition-colors relative group"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors w-full"
                      data-testid={`button-${service.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {service.action}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-auto cursor-not-allowed opacity-75 w-full"
                    data-testid={`button-${service.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    disabled
                  >
                    {service.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
