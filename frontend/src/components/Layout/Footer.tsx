import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logoImage from "../../assets/logoMS.svg";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "Pandit Booking", href: "/pandit" },
      { label: "Live Darshans", href: "#" },
      { label: "Virtual Temple Tours", href: "#" },
      { label: "Spiritual Library", href: "#" },
      { label: "Join as Pandit", href: "#services" }
    ]
  },
  {
    title: "Spiritual Tools",
    links: [
      { label: "Panchang", href: "/panchang" },
      { label: "Muhurat Finder", href: "/muhurat" },
      { label: "Rashifal", href: "/rashifal" },
      { label: "Kundali Creation", href: "/kundali" },
      { label: "Gemstone Guide", href: "/gemstone-guide" },
      { label: "Choghadiya", href: "/choghadiya" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Mission", href: "#about" },
      { label: "Partner with Us", href: "#" },
      { label: "Careers", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" }
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" }
];

export default function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (link: { label: string; href: string }) => {
    if (link.label === "Join as Pandit") {
      navigate("/pandit-onboarding");
    } else {
      // Handle other links normally - could be anchor links or navigation
      if (link.href.startsWith('#')) {
        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-card border-t border-border py-14">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="MantraSetu Logo" 
                className="h-20 w-auto mb-2 scale-[1.4]"
              />
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Bridging culture, devotion, and convenience in one place. Where mantras flow, divinity grows.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                {/* <Phone className="w-4 h-4" />
                <span>+91 88228 82264</span> */}
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@mantrasetu.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Bhopal, Madhya Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.label === "Join as Pandit" ? (
                      <button 
                        onClick={() => handleLinkClick(link)}
                        className="text-muted-foreground hover:text-primary transition-colors text-left"
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith('#')) {
                            e.preventDefault();
                            handleLinkClick(link);
                          }
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold text-foreground mb-2">Stay Connected</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Get spiritual insights, festival updates, and exclusive offers
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                type="email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-muted-foreground text-sm">
              © 2025 MantraSetu Solutions Pvt. Ltd. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}