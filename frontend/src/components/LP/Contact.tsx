import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, Building } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { contactAPI } from "../../services/api";
import PartnershipForm from "./PartnershipForm";

const contactInfo = [
  // {
  //   icon: Phone,
  //   title: "Phone",
  //   detail: "+91 88228 82264",
  //   description: "Mon-Sun, 6:00 AM - 10:00 PM"
  // },
  {
    icon: Mail,
    title: "Email",
    detail: "support@mantrasetu.com",
    description: "We'll respond within 24 hours"
  },
  {
    icon: MapPin,
    title: "Address",
    detail: "Bhopal, Madhya Pradesh",
    description: "India"
  },
  {
    icon: Clock,
    title: "Support Hours",
    detail: "24/7 Available",
    description: "For urgent spiritual needs"
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general" // general, partnership, support
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  const handlePartnerWithUs = () => {
    setShowPartnershipForm(true);
  };

  const handleCloseForm = () => {
    setShowPartnershipForm(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Map frontend type to backend type
      const typeMap: Record<string, "GENERAL" | "SUPPORT" | "PARTNERSHIP" | "FEEDBACK" | "COMPLAINT"> = {
        general: "GENERAL",
        support: "SUPPORT",
        partnership: "PARTNERSHIP",
        feedback: "FEEDBACK",
        complaint: "COMPLAINT",
      };

      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
        type: typeMap[formData.type] || "GENERAL",
      };

      // Single endpoint - works for anyone, authenticated or not
      const response = await contactAPI.createContact(contactData);

      if (response.data.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          type: "general"
        });
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 
                    error.response?.data?.error || 
                    "Failed to submit contact form. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to connect with authentic spiritual services? We're here to help you on your divine journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Multiple ways to reach our spiritual support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      <p className="text-foreground text-sm">{info.detail}</p>
                      <p className="text-muted-foreground text-xs">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Partnership CTA */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Temple Partnership</CardTitle>
                <CardDescription>
                  Are you a temple or spiritual organization?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our network to reach more devotees and preserve spiritual traditions together.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-partnership-inquiry"
                  onClick={handlePartnerWithUs}
                >
                  Partnership Inquiry
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input
                        id="contact-name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        placeholder="+91 91234 XXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input
                        id="contact-subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                        data-testid="input-contact-subject"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your requirements, questions, or how we can assist you..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    data-testid="button-contact-submit"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Partnership Form Modal */}
      {showPartnershipForm && (
        <PartnershipForm onClose={handleCloseForm} />
      )}
    </section>
  );
}