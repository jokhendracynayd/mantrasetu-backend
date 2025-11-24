import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { key: "en", label: "English", native: "English" },
  { key: "hi", label: "Hindi", native: "हिन्दी" },
  { key: "ta", label: "Tamil", native: "தமிழ்" },
  { key: "te", label: "Telugu", native: "తెలుగు" },
  { key: "sa", label: "Sanskrit", native: "संस्कृतम्" },
];

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 min-w-[120px]">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm flex-1 text-left">{selectedLanguage.native}</span>
          <ChevronDown className="w-3 h-3 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.key}
            onClick={() => setSelectedLanguage(language)}
            className={selectedLanguage.key === language.key ? "bg-accent" : ""}
          >
            <span className="flex items-center gap-2">
              {language.native}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

