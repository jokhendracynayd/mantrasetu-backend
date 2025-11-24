// import { Button } from "@/components/ui/button";
import { Calendar, Play, Users, BookOpen, Globe, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@assets/stock_Images/Majestic_temple_complex_sunrise_3e522441.webp";
import { Button } from "../ui/button";

export default function Hero() {
  const navigate = useNavigate();
  const handleBookService = () => {
    navigate("/services");
  };

  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="mb-6">
            <p className="text-white/90 text-lg italic">
              Authentic Pujas. Verified Panditjis. Divine Experience.
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Where Mantras Flow,{" "}
            <span className="text-yellow-400">Divinity Grows</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Connect with authentic Pandit services, live darshans, and spiritual
            guidance. Experience India's sacred traditions through our trusted
            platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
              data-testid="button-book-service"
              onClick={handleBookService}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Service
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 text-lg"
              data-testid="button-watch-demo"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/90">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm">Verified Pandits</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm">Authentic Vidhi</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm">Multi-Language Support</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Wifi className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm">Online & Offline Services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
