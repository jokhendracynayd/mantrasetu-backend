import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Heart,
  Share2,
  BookOpen,
  Gift,
  Sparkles,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPujaById } from "../data/dummyPujas";
import type { PujaDetail } from "../data/dummyPujas";
import { serviceAPI } from "../services/api";
import { extractServiceId } from "../utils/slug";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  duration: string;
  difficulty?: string;
  locationType: string;
  panditRequired?: boolean;
  locationDetails?: string;
  category: string;
  imageUrl?: string;
  benefits?: string[];
  included?: string[];
  requirements?: string[];
  relatedTopics?: string[];
  availableDays?: string[];
  isAvailable?: boolean;
  durationMinutes?: number;
  basePrice?: number;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [puja, setPuja] = useState<PujaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        navigate("/services");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First try to fetch from API using the ID/slug
        const serviceId = extractServiceId(id);
        
        try {
          const response = await serviceAPI.getService(serviceId);
          const serviceData: ServiceData = response.data;

          // Convert API service to PujaDetail format
          const convertedPuja: PujaDetail = {
            id: serviceData.id,
            name: serviceData.name,
            description: serviceData.description,
            longDescription: serviceData.longDescription || serviceData.description,
            price: serviceData.basePrice || serviceData.price,
            duration: serviceData.duration || `${serviceData.durationMinutes || 60} minutes`,
            difficulty: serviceData.difficulty || "Moderate",
            locationType: serviceData.isVirtual ? "Virtual" : serviceData.locationType || "Home Visit",
            panditRequired: serviceData.panditRequired ?? true,
            locationDetails: serviceData.locationDetails || "Pandit will visit your location",
            category: serviceData.category,
            imageUrl: serviceData.imageUrl,
            benefits: serviceData.benefits || [],
            included: serviceData.included || [],
            requirements: serviceData.requirements || [],
            relatedTopics: serviceData.relatedTopics || serviceData.tags || [],
            availableDays: serviceData.availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            isAvailable: serviceData.isAvailable ?? true,
          };

          setPuja(convertedPuja);
        } catch (apiError) {
          // If API fails, try dummy data
          console.log("API fetch failed, trying dummy data:", apiError);
          const pujaData = getPujaById(id);
          if (pujaData) {
            setPuja(pujaData);
          } else {
            setError("Service not found");
            setTimeout(() => navigate("/services"), 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setError("Failed to load service details");
        setTimeout(() => navigate("/services"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !puja) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">
            {error || "Service not found"}
          </p>
          <Button onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    navigate(`/bookings?service=${puja.id}`);
  };

  const handleContact = (type: "call" | "email") => {
    if (type === "call") {
      window.location.href = "tel:+919876543210";
    } else {
      window.location.href = "mailto:support@mantrasetu.com";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Services</span>
          </button> */}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm font-medium">Religious</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {puja.name}
              </h1>

              <p className="text-lg text-orange-100 mb-6 max-w-2xl">
                {puja.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{puja.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{puja.locationType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{puja.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Right Price Card */}
            <div className="md:col-span-1">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{puja.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">inc</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    size="lg"
                    onClick={handleBooking}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book This Puja
                  </Button>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={true}
                      className="cursor-not-allowed"
                      onClick={() => handleContact("call")}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContact("email")}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>

                  {puja.isAvailable && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Available for booking</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About This Puja */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  About This Puja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {puja.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Benefits & Blessings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Benefits & Blessings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {puja.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {puja.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements & Preparation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Requirements & Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {puja.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Puja Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puja Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{puja.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    {puja.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location Type</span>
                  <span className="font-medium text-right">
                    {puja.locationType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pandit Required</span>
                  <span className="font-medium">
                    {puja.panditRequired ? "Yes" : "No"}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Location Details
                  </p>
                  <p className="text-sm">{puja.locationDetails}</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {puja.relatedTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Days */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className={`p-2 text-center rounded-md text-sm font-medium ${
                          puja.availableDays.includes(day)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is available to answer your questions about this
                  puja.
                </p>
                <Button className="w-full" variant="default">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
