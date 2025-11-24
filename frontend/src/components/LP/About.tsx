import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Heart, Shield, Lightbulb, Users, Globe, Sparkles } from "lucide-react";
import PartnershipForm from "./PartnershipForm";
import { Button } from "../ui/button";


const values = [
  {
    icon: Shield,
    title: "Authenticity",
    description: "Upholding the purity of Vedic traditions, rituals, and spiritual practices"
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making spiritual services and divine experiences available to all, anytime and anywhere"
  },
  {
    icon: Heart,
    title: "Trust",
    description: "Building a reliable and transparent platform for devotees, pandits, and institutions"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Using technology to enrich spiritual journeys while preserving cultural roots"
  },
  {
    icon: Users,
    title: "Community & Culture",
    description: "Promoting Indian heritage, fostering connections, and nurturing collective well-being"
  },
  {
    icon: Sparkles,
    title: "Devotion with Integrity",
    description: "Serving with sincerity, respect, and faith at the core of every interaction"
  }
];

export default function About() {
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  const handlePartnerWithUs = () => {
    setShowPartnershipForm(true);
  };

  const handleCloseForm = () => {
    setShowPartnershipForm(false);
  };

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Mission & Vision */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Sacred Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the most trusted global platform that preserves and promotes Indian 
                  spiritual traditions by seamlessly blending devotion with technology, making 
                  divine experiences accessible to everyone, anywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To connect people with authentic rituals, spiritual services, and India's 
                  cultural heritage in a simple, modern, and trustworthy way through 
                  technology-driven spiritual experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Philosophy */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Core Philosophy</h3>
            <p className="text-xl text-primary italic font-medium">
              "Blending authenticity, technology, and devotion to make spirituality accessible and meaningful for all."
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card 
                key={value.title} 
                className="hover-elevate text-center h-full"
                data-testid={`card-value-${value.title.toLowerCase().replace(' ', '-')}`}
              >
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Join Our Spiritual Journey</CardTitle>
              <CardDescription className="text-lg">
                Be part of a movement to keep spirituality alive, relevant, and accessible for generations to come
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                data-testid="button-partner-with-us"
                onClick={handlePartnerWithUs}
              >
                <Users className="w-5 h-5 mr-2" />
                Partner with Us
              </Button>
              <Button variant="outline" size="lg" data-testid="button-learn-more-about">
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Partnership Form Modal */}
      {showPartnershipForm && (
        <PartnershipForm onClose={handleCloseForm} />
      )}
    </section>
  );
}