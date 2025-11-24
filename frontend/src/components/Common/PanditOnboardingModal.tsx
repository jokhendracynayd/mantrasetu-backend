import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Upload } from "lucide-react";

// Form data type
interface PanditFormData {
  name: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  age: number;
  languages: string[];
  qualifications: string[];
  photoUrl?: string;
  status: string;
}

const LANGUAGE_OPTIONS = ["Sanskrit", "Hindi", "Tamil", "Telugu", "Other"];
const QUALIFICATION_OPTIONS = [
  "BA in Sanskrit",
  "MA in Sanskrit",
  "Acharya in Sanskrit",
  "Acharya/Shashtri",
  "Other",
];

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

interface PanditOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PanditOnboardingModal({
  open,
  onOpenChange,
}: PanditOnboardingModalProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<PanditFormData>({
    name: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    age: 25,
    languages: [],
    qualifications: [],
    photoUrl: "",
    status: "pending",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PanditFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PanditFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (formData.age < 18 || formData.age > 80) {
      newErrors.age = "Age must be between 18 and 80";
    }
    if (formData.languages.length === 0) {
      newErrors.languages = "Select at least one language";
    }
    if (formData.qualifications.length === 0) {
      newErrors.qualifications = "Select at least one qualification";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call with a delay
    setTimeout(() => {
      console.log("Pandit Application Data:", {
        ...formData,
        photoFile: photoFile?.name,
      });

      toast({
        title: "Application Submitted Successfully!",
        description:
          "Your Pandit application has been submitted. We'll review it and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        state: "",
        city: "",
        age: 25,
        languages: [],
        qualifications: [],
        photoUrl: "",
        status: "pending",
      });
      setPhotoFile(null);
      setErrors({});
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleQualificationToggle = (qualification: string) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualification)
        ? prev.qualifications.filter((q) => q !== qualification)
        : [...prev.qualifications, qualification],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Join as Pandit
          </DialogTitle>
          <DialogDescription>
            Share your knowledge and serve the community. Fill out this form to
            apply as a registered Pandit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    data-testid="input-pandit-name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age
                  </label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
                    }
                    data-testid="input-pandit-age"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium">
                    Mobile Number
                  </label>
                  <Input
                    id="mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    data-testid="input-pandit-mobile"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">{errors.mobile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    data-testid="input-pandit-email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">
                    State
                  </label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                    data-testid="select-pandit-state"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    data-testid="input-pandit-city"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Languages Known</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <div
                      key={language}
                      className="flex flex-row items-center space-x-3"
                    >
                      <Checkbox
                        id={`language-${language}`}
                        checked={formData.languages.includes(language)}
                        onCheckedChange={() => handleLanguageToggle(language)}
                        data-testid={`checkbox-language-${language.toLowerCase()}`}
                      />
                      <label
                        htmlFor={`language-${language}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.languages && (
                  <p className="text-sm text-red-500">{errors.languages}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-3">
                  {QUALIFICATION_OPTIONS.map((qualification) => (
                    <div
                      key={qualification}
                      className="flex flex-row items-center space-x-3"
                    >
                      <Checkbox
                        id={`qualification-${qualification}`}
                        checked={formData.qualifications.includes(qualification)}
                        onCheckedChange={() =>
                          handleQualificationToggle(qualification)
                        }
                        data-testid={`checkbox-qualification-${qualification
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      />
                      <label
                        htmlFor={`qualification-${qualification}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {qualification}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.qualifications && (
                  <p className="text-sm text-red-500">{errors.qualifications}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Profile Photo (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                  data-testid="input-pandit-photo"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                  className="flex items-center gap-2"
                  data-testid="button-upload-photo"
                >
                  <Upload className="w-4 h-4" />
                  Choose Photo
                </Button>
                {photoFile && (
                  <span className="text-sm text-muted-foreground">
                    Selected: {photoFile.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-pandit-form"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-pandit-form"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
