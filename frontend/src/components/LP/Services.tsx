import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, Camera, Users, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import panditImage from "@assets/stock_Images/Traditional_Pandit_performing_ceremony_d032431f.webp";
import darshanImage from "@assets/stock_Images/Temple_live_darshan_interior_4b181d61.webp";
import tourImage from "@assets/stock_Images/Virtual_temple_tour_exterior_77b74f51.webp";

const services = [
  {
    icon: Calendar,
    title: "Pandit Ji Booking",
    description: "Book experienced Pandits for weddings, Grah Pravesh, Satyanarayan Katha, and all sacred rituals",
    features: ["Verified Pandits", "Flexible scheduling", "All rituals covered"],
    image: panditImage,
    action: "learn-more",
    isAvailable: true
  },
  {
    icon: Camera,
    title: "Live Darshans",
    description: "Experience divine darshans from famous temples across India in real-time",
    features: ["HD live streaming", "Multiple temples", "Interactive prayers"],
    image: darshanImage,
    action: "learn-more",
    isAvailable: false
  },
  {
    icon: MapPin,
    title: "Virtual Temple Tours",
    description: "Explore sacred temples and their history through immersive virtual experiences",
    features: ["360° tours", "Cultural insights", "Historical context"],
    image: tourImage,
    action: "learn-more",
    isAvailable: false
  }
];

export default function Services() {
  const navigate = useNavigate();
  const handleBookService = () => {
    navigate("/services");
  };
  const handleLearnMore = (serviceTitle: string) => {
    if (serviceTitle === "Pandit Ji Booking") {
      // Navigate to a popular puja service detail page
      // You can change this to navigate to /services to show all services
      navigate('/puja/seed-puja-6');
    } else if (serviceTitle === "Live Darshans") {
      navigate('/services?category=VIRTUAL');
    } else if (serviceTitle === "Virtual Temple Tours") {
      navigate('/services?category=VIRTUAL');
    }
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Sacred Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting you with authentic spiritual experiences and preserving India's rich cultural heritage
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className={`h-full flex flex-col relative ${
                service.isAvailable
                  ? "hover-elevate cursor-pointer group"
                  : "opacity-75"
              }`}
              data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Launching Soon Ribbon */}
              {!service.isAvailable && (
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
              <CardHeader className="space-y-4 flex-shrink-0">
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      service.isAvailable ? "group-hover:scale-105" : ""
                    }`}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-center">{service.title}</CardTitle>
                  <CardDescription className="text-center mt-2">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex-grow flex flex-col">
                <ul className="space-y-2 mb-4 flex-grow">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={service.isAvailable ? "outline" : "secondary"}
                  className={`w-full mt-auto ${
                    service.isAvailable ? "group" : "cursor-not-allowed opacity-75"
                  }`}
                  disabled={!service.isAvailable}
                  onClick={() => handleLearnMore(service.title)}
                  data-testid={`button-${service.action}-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {service.isAvailable ? (
                    <>
                      Learn More
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

        <div className="text-center mt-12">
          <Button onClick={handleBookService}  size="lg" data-testid="button-view-all-services">
            <Users className="w-5 h-5 mr-2" />
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}