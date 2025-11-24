import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button"; 
import { Calendar, Star, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import satyanarayanImage from "@assets/stock_Images/Satyanarayan_Puja_ceremony_setup_d7708e08.webp";
import laxmiImage from "@assets/stock_Images/Diwali_Laxmi_Puja_setup_e90668f2.webp";
import govardhanImage from "@assets/stock_Images/Govardhan_Puja_food_offerings_3b646a1f.webp";
import bhaiDoojImage from "@assets/stock_Images/Diwali_Laxmi_Puja_setup_e90668f2.webp";

const specialPujas = [
  {
    id: "seed-puja-6", // Satyanarayan Puja
    title: "Satyanarayan Puja",
    description: "Sacred ritual for Lord Vishnu seeking blessings and prosperity",
    image: satyanarayanImage,
    duration: "2-3 hours",
    benefits: ["Prosperity", "Peace", "Success"]
  },
  {
    id: "seed-puja-7", // Diwali Laxmi Puja
    title: "Diwali Laxmi Puja",
    description: "Festival of lights celebrating Goddess Laxmi for wealth and abundance",
    image: laxmiImage,
    duration: "1-2 hours",
    benefits: ["Wealth", "Abundance", "Fortune"]
  },
  {
    id: "seed-puja-8", // Govardhan Puja
    title: "Govardhan Puja",
    description: "Celebrating Lord Krishna's protection and the abundance of nature",
    image: govardhanImage,
    duration: "2-4 hours",
    benefits: ["Protection", "Abundance", "Gratitude"]
  },
  {
    id: "seed-puja-9", // Bhai Dooj Puja
    title: "Bhai Dooj Puja",
    description: "Sacred celebration of sibling bond and family protection",
    image: bhaiDoojImage,
    duration: "1 hour",
    benefits: ["Family Bond", "Protection", "Love"]
  }
];

export default function SpecialPujas() {
  const navigate = useNavigate();

  const handleBookPuja = (pujaId: string) => {
    navigate(`/puja/${pujaId}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            MantraSetu Special Pujas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience authentic traditional pujas performed by expert Pandits for your spiritual well-being
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {specialPujas.map((puja, index) => (
            <Card 
              key={puja.title} 
              className="hover-elevate cursor-pointer group border-primary/20 h-full flex flex-col"
              data-testid={`card-puja-${puja.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader className="p-0 flex-shrink-0">
                <div className="w-full h-48 rounded-t-lg overflow-hidden">
                  <img 
                    src={puja.image} 
                    alt={puja.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="text-lg mb-2 flex items-center gap-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {puja.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm mb-3 flex-grow">
                  {puja.description}
                </p>
                
                <div className="space-y-2 mb-4 flex-shrink-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Duration: {puja.duration}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {puja.benefits.map((benefit) => (
                      <span 
                        key={benefit} 
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto"
                  data-testid={`button-book-${puja.title.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleBookPuja(puja.id)}
                >
                  Book Puja
                  <Star className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            data-testid="button-explore-more-pujas"
            onClick={() => navigate('/services')}
          >
            Explore More Pujas
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}