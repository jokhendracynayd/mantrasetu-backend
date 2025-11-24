# Internationalization (i18n) Implementation Guide

## Overview

This guide provides comprehensive instructions for implementing multi-language support in the MantraSetu application. The application supports the following languages:

- **English (en)** - Default language
- **Hindi (hi)** - हिन्दी
- **Sanskrit (sa)** - संस्कृतम्
- **Tamil (ta)** - தமிழ்
- **Telugu (te)** - తెలుగు

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Directory Structure](#directory-structure)
4. [Configuration](#configuration)
5. [Translation Files](#translation-files)
6. [Implementation Steps](#implementation-steps)
7. [Usage Examples](#usage-examples)
8. [Language Switcher Component](#language-switcher-component)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

The following packages are already installed in your project:

- `react-i18next` (^16.0.0) - React integration for i18next
- `i18next` - Core internationalization framework

If you need to install them manually:

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

---

## Project Setup

### Step 1: Install Additional Dependencies (if needed)

```bash
cd frontend
npm install i18next-browser-languagedetector
```

The `i18next-browser-languagedetector` package automatically detects the user's browser language preference.

---

## Directory Structure

Create the following directory structure for translation files:

```
frontend/
├── src/
│   ├── i18n/
│   │   ├── config.ts          # i18n configuration
│   │   └── locales/
│   │       ├── en/
│   │       │   └── translation.json
│   │       ├── hi/
│   │       │   └── translation.json
│   │       ├── sa/
│   │       │   └── translation.json
│   │       ├── ta/
│   │       │   └── translation.json
│   │       └── te/
│   │           └── translation.json
```

---

## Configuration

### Step 2: Create i18n Configuration File

Create `frontend/src/i18n/config.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';
import saTranslations from './locales/sa/translation.json';
import taTranslations from './locales/ta/translation.json';
import teTranslations from './locales/te/translation.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  sa: {
    translation: saTranslations,
  },
  ta: {
    translation: taTranslations,
  },
  te: {
    translation: teTranslations,
  },
};

i18n
  .use(LanguageDetector) // Detects user language from browser
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    lng: 'en', // Initial language
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // React i18next options
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  });

export default i18n;
```

### Step 3: Initialize i18n in main.tsx

Update `frontend/src/main.tsx` to import the i18n configuration:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { store } from './store/store';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import './index.css';
import './i18n/config'; // Import i18n configuration

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

---

## Translation Files

### Step 4: Create Translation Files

Create translation JSON files for each language. Here's the structure:

#### English (`frontend/src/i18n/locales/en/translation.json`)

```json
{
  "common": {
    "welcome": "Welcome",
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact",
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "search": "Search",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember Me",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "firstName": "First Name",
    "lastName": "Last Name",
    "phone": "Phone Number",
    "alreadyHaveAccount": "Already have an account?",
    "dontHaveAccount": "Don't have an account?"
  },
  "services": {
    "title": "Our Services",
    "bookNow": "Book Now",
    "viewDetails": "View Details",
    "puja": "Puja",
    "astrology": "Astrology",
    "consultation": "Consultation"
  },
  "pandit": {
    "title": "Pandits",
    "bookPandit": "Book Pandit",
    "experience": "Experience",
    "years": "years",
    "specialization": "Specialization",
    "languages": "Languages Spoken"
  },
  "booking": {
    "title": "Book a Service",
    "selectDate": "Select Date",
    "selectTime": "Select Time",
    "totalAmount": "Total Amount",
    "confirmBooking": "Confirm Booking"
  }
}
```

#### Hindi (`frontend/src/i18n/locales/hi/translation.json`)

```json
{
  "common": {
    "welcome": "स्वागत है",
    "home": "होम",
    "about": "के बारे में",
    "services": "सेवाएं",
    "contact": "संपर्क करें",
    "login": "लॉग इन",
    "register": "पंजीकरण",
    "logout": "लॉग आउट",
    "dashboard": "डैशबोर्ड",
    "profile": "प्रोफ़ाइल",
    "settings": "सेटिंग्स",
    "search": "खोजें",
    "submit": "जमा करें",
    "cancel": "रद्द करें",
    "save": "सहेजें",
    "delete": "हटाएं",
    "edit": "संपादित करें",
    "back": "वापस",
    "next": "अगला",
    "previous": "पिछला",
    "loading": "लोड हो रहा है...",
    "error": "त्रुटि",
    "success": "सफल"
  },
  "auth": {
    "email": "ईमेल",
    "password": "पासवर्ड",
    "confirmPassword": "पासवर्ड की पुष्टि करें",
    "forgotPassword": "पासवर्ड भूल गए?",
    "rememberMe": "मुझे याद रखें",
    "signIn": "साइन इन करें",
    "signUp": "साइन अप करें",
    "firstName": "पहला नाम",
    "lastName": "अंतिम नाम",
    "phone": "फ़ोन नंबर",
    "alreadyHaveAccount": "पहले से खाता है?",
    "dontHaveAccount": "खाता नहीं है?"
  },
  "services": {
    "title": "हमारी सेवाएं",
    "bookNow": "अभी बुक करें",
    "viewDetails": "विवरण देखें",
    "puja": "पूजा",
    "astrology": "ज्योतिष",
    "consultation": "परामर्श"
  },
  "pandit": {
    "title": "पंडित",
    "bookPandit": "पंडित बुक करें",
    "experience": "अनुभव",
    "years": "वर्ष",
    "specialization": "विशेषज्ञता",
    "languages": "बोली जाने वाली भाषाएं"
  },
  "booking": {
    "title": "सेवा बुक करें",
    "selectDate": "तारीख चुनें",
    "selectTime": "समय चुनें",
    "totalAmount": "कुल राशि",
    "confirmBooking": "बुकिंग की पुष्टि करें"
  }
}
```

#### Sanskrit (`frontend/src/i18n/locales/sa/translation.json`)

```json
{
  "common": {
    "welcome": "स्वागतम्",
    "home": "गृहम्",
    "about": "विषये",
    "services": "सेवाः",
    "contact": "सम्पर्कः",
    "login": "प्रवेशः",
    "register": "पंजीकरणम्",
    "logout": "निर्गमनम्",
    "dashboard": "नियन्त्रणपट्टः",
    "profile": "प्रोफाइल्",
    "settings": "विन्यासः",
    "search": "अन्वेषणम्",
    "submit": "प्रस्तुतम्",
    "cancel": "रद्दम्",
    "save": "सुरक्षितम्",
    "delete": "मिटाना",
    "edit": "सम्पादनम्",
    "back": "पृष्ठभूमिः",
    "next": "अग्रिमः",
    "previous": "पूर्वः",
    "loading": "लोड हो रहा है...",
    "error": "त्रुटिः",
    "success": "सफलता"
  },
  "auth": {
    "email": "ईमेल",
    "password": "कूटशब्दः",
    "confirmPassword": "कूटशब्दस्य पुष्टिः",
    "forgotPassword": "कूटशब्दः विस्मृतम्?",
    "rememberMe": "मां स्मरतु",
    "signIn": "प्रवेशः करोतु",
    "signUp": "पंजीकरणं करोतु",
    "firstName": "प्रथमनाम",
    "lastName": "अन्तिमनाम",
    "phone": "दूरभाषसङ्ख्या",
    "alreadyHaveAccount": "पूर्वं खातं अस्ति?",
    "dontHaveAccount": "खातं नास्ति?"
  },
  "services": {
    "title": "अस्माकं सेवाः",
    "bookNow": "अधुना बुक करोतु",
    "viewDetails": "विवरणं दृष्ट्वा",
    "puja": "पूजा",
    "astrology": "ज्योतिषशास्त्रम्",
    "consultation": "परामर्शः"
  },
  "pandit": {
    "title": "पण्डिताः",
    "bookPandit": "पण्डितं बुक करोतु",
    "experience": "अनुभवः",
    "years": "वर्षाणि",
    "specialization": "विशेषज्ञता",
    "languages": "भाषाः"
  },
  "booking": {
    "title": "सेवां बुक करोतु",
    "selectDate": "तिथिं चिनोतु",
    "selectTime": "समयं चिनोतु",
    "totalAmount": "कुलराशिः",
    "confirmBooking": "बुकिंगस्य पुष्टिः करोतु"
  }
}
```

#### Tamil (`frontend/src/i18n/locales/ta/translation.json`)

```json
{
  "common": {
    "welcome": "வரவேற்கிறோம்",
    "home": "வீடு",
    "about": "பற்றி",
    "services": "சேவைகள்",
    "contact": "தொடர்பு",
    "login": "உள்நுழை",
    "register": "பதிவு",
    "logout": "வெளியேற",
    "dashboard": "டாஷ்போர்டு",
    "profile": "சுயவிவரம்",
    "settings": "அமைப்புகள்",
    "search": "தேடு",
    "submit": "சமர்ப்பி",
    "cancel": "ரத்துசெய்",
    "save": "சேமி",
    "delete": "நீக்கு",
    "edit": "திருத்து",
    "back": "பின்",
    "next": "அடுத்து",
    "previous": "முந்தைய",
    "loading": "ஏற்றுகிறது...",
    "error": "பிழை",
    "success": "வெற்றி"
  },
  "auth": {
    "email": "மின்னஞ்சல்",
    "password": "கடவுச்சொல்",
    "confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்த",
    "forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?",
    "rememberMe": "என்னை நினைவில் வை",
    "signIn": "உள்நுழைக",
    "signUp": "பதிவு செய்க",
    "firstName": "முதல் பெயர்",
    "lastName": "கடைசி பெயர்",
    "phone": "தொலைபேசி எண்",
    "alreadyHaveAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "dontHaveAccount": "கணக்கு இல்லையா?"
  },
  "services": {
    "title": "எங்கள் சேவைகள்",
    "bookNow": "இப்போது பதிவு செய்",
    "viewDetails": "விவரங்களைக் காண்க",
    "puja": "பூஜை",
    "astrology": "ஜோதிடம்",
    "consultation": "ஆலோசனை"
  },
  "pandit": {
    "title": "பண்டிதர்கள்",
    "bookPandit": "பண்டிதரை பதிவு செய்",
    "experience": "அனுபவம்",
    "years": "ஆண்டுகள்",
    "specialization": "சிறப்புத் திறன்",
    "languages": "பேசப்படும் மொழிகள்"
  },
  "booking": {
    "title": "சேவையை பதிவு செய்",
    "selectDate": "தேதியைத் தேர்ந்தெடு",
    "selectTime": "நேரத்தைத் தேர்ந்தெடு",
    "totalAmount": "மொத்த தொகை",
    "confirmBooking": "பதிவை உறுதிப்படுத்து"
  }
}
```

#### Telugu (`frontend/src/i18n/locales/te/translation.json`)

```json
{
  "common": {
    "welcome": "స్వాగతం",
    "home": "హోమ్",
    "about": "గురించి",
    "services": "సేవలు",
    "contact": "సంప్రదించండి",
    "login": "లాగిన్",
    "register": "నమోదు",
    "logout": "లాగ్అవుట్",
    "dashboard": "డాష్బోర్డ్",
    "profile": "ప్రొఫైల్",
    "settings": "సెట్టింగ్‌లు",
    "search": "శోధించండి",
    "submit": "సమర్పించండి",
    "cancel": "రద్దు చేయండి",
    "save": "సేవ్ చేయండి",
    "delete": "తొలగించండి",
    "edit": "సవరించండి",
    "back": "వెనక్కి",
    "next": "తరువాత",
    "previous": "మునుపటి",
    "loading": "లోడ్ అవుతోంది...",
    "error": "దోషం",
    "success": "విజయం"
  },
  "auth": {
    "email": "ఇమెయిల్",
    "password": "పాస్‌వర్డ్",
    "confirmPassword": "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    "forgotPassword": "పాస్‌వర్డ్ మర్చిపోయారా?",
    "rememberMe": "నన్ను గుర్తుంచుకో",
    "signIn": "సైన్ ఇన్",
    "signUp": "సైన్ అప్",
    "firstName": "మొదటి పేరు",
    "lastName": "చివరి పేరు",
    "phone": "ఫోన్ నంబర్",
    "alreadyHaveAccount": "ఇప్పటికే ఖాతా ఉందా?",
    "dontHaveAccount": "ఖాతా లేదా?"
  },
  "services": {
    "title": "మా సేవలు",
    "bookNow": "ఇప్పుడే బుక్ చేయండి",
    "viewDetails": "వివరాలను వీక్షించండి",
    "puja": "పూజ",
    "astrology": "జ్యోతిష్యం",
    "consultation": "సలహా"
  },
  "pandit": {
    "title": "పండితులు",
    "bookPandit": "పండితుడిని బుక్ చేయండి",
    "experience": "అనుభవం",
    "years": "సంవత్సరాలు",
    "specialization": "ప్రత్యేకత",
    "languages": "మాట్లాడే భాషలు"
  },
  "booking": {
    "title": "సేవను బుక్ చేయండి",
    "selectDate": "తేదీని ఎంచుకోండి",
    "selectTime": "సమయాన్ని ఎంచుకోండి",
    "totalAmount": "మొత్తం మొత్తం",
    "confirmBooking": "బుకింగ్‌ను నిర్ధారించండి"
  }
}
```

---

## Implementation Steps

### Step 5: Update Language Selector Component

Update `frontend/src/components/Layout/Header/LanguageSelector.tsx` to actually change the language:

```typescript
import { useState, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { key: "en", label: "English", native: "English" },
  { key: "hi", label: "Hindi", native: "हिन्दी" },
  { key: "ta", label: "Tamil", native: "தமிழ்" },
  { key: "te", label: "Telugu", native: "తెలుగు" },
  { key: "sa", label: "Sanskrit", native: "संस्कृतम्" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    LANGUAGES.find((lang) => lang.key === i18n.language) || LANGUAGES[0]
  );

  // Update selected language when i18n language changes
  useEffect(() => {
    const currentLang = LANGUAGES.find((lang) => lang.key === i18n.language) || LANGUAGES[0];
    setSelectedLanguage(currentLang);
  }, [i18n.language]);

  const handleLanguageChange = (languageKey: string) => {
    i18n.changeLanguage(languageKey);
    setSelectedLanguage(LANGUAGES.find((lang) => lang.key === languageKey) || LANGUAGES[0]);
  };

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
            onClick={() => handleLanguageChange(language.key)}
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
```

### Step 6: Update useT Hook

Update `frontend/src/hooks/useT.ts`:

```typescript
import { useTranslation } from "react-i18next";

export default function useT() {
  const { t, i18n } = useTranslation();
  return { t, i18n };
}
```

---

## Usage Examples

### Basic Usage in Components

```typescript
import React from 'react';
import useT from '@/hooks/useT';

const MyComponent = () => {
  const { t } = useT();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
};

export default MyComponent;
```

### Usage with Variables/Interpolation

```typescript
import React from 'react';
import useT from '@/hooks/useT';

const GreetingComponent = () => {
  const { t } = useT();
  const userName = 'John';

  return (
    <div>
      <p>{t('common.welcome', { name: userName })}</p>
    </div>
  );
};
```

For this to work, update your translation files:

```json
{
  "common": {
    "welcome": "Welcome, {{name}}!"
  }
}
```

### Usage with Pluralization

```typescript
import React from 'react';
import useT from '@/hooks/useT';

const ItemCount = ({ count }: { count: number }) => {
  const { t } = useT();

  return (
    <div>
      <p>{t('items.count', { count })}</p>
    </div>
  );
};
```

Translation file:

```json
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  }
}
```

### Usage in Form Labels

```typescript
import React from 'react';
import useT from '@/hooks/useT';

const LoginForm = () => {
  const { t } = useT();

  return (
    <form>
      <label>{t('auth.email')}</label>
      <input type="email" />
      
      <label>{t('auth.password')}</label>
      <input type="password" />
      
      <button type="submit">{t('auth.signIn')}</button>
    </form>
  );
};
```

### Usage with React Router

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import useT from '@/hooks/useT';

const Navigation = () => {
  const { t } = useT();

  return (
    <nav>
      <Link to="/">{t('common.home')}</Link>
      <Link to="/services">{t('common.services')}</Link>
      <Link to="/contact">{t('common.contact')}</Link>
    </nav>
  );
};
```

---

## Language Switcher Component

The language switcher component is already implemented in `LanguageSelector.tsx`. It:

1. Displays the current language in its native script
2. Allows users to switch between languages
3. Persists the language preference in localStorage
4. Automatically updates all translated content

### Adding Language Switcher to Header

Make sure the `LanguageSelector` component is included in your header:

```typescript
import LanguageSelector from '@/components/Layout/Header/LanguageSelector';

const Header = () => {
  return (
    <header>
      {/* Other header content */}
      <LanguageSelector />
    </header>
  );
};
```

---

## Best Practices

### 1. Translation Key Naming Convention

Use a hierarchical structure with namespaces:

```
common.*          - Common UI elements
auth.*            - Authentication related
services.*        - Service related
pandit.*          - Pandit related
booking.*         - Booking related
errors.*          - Error messages
validation.*      - Form validation messages
```

### 2. Keep Translation Keys Consistent

Always use the same key structure across all language files. If you add a new key to English, add it to all other languages (even if temporarily empty).

### 3. Avoid Hardcoding Text

❌ **Bad:**
```typescript
<button>Submit</button>
```

✅ **Good:**
```typescript
<button>{t('common.submit')}</button>
```

### 4. Handle Missing Translations

i18next will fall back to the key name if a translation is missing. You can also set up a fallback language:

```typescript
i18n.init({
  fallbackLng: 'en', // Always fall back to English
  // ...
});
```

### 5. Organize Large Translation Files

For large applications, split translations into multiple files:

```
locales/
  en/
    common.json
    auth.json
    services.json
  hi/
    common.json
    auth.json
    services.json
```

Then import them in `config.ts`:

```typescript
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import hiCommon from './locales/hi/common.json';
import hiAuth from './locales/hi/auth.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
  },
  hi: {
    common: hiCommon,
    auth: hiAuth,
  },
};
```

Usage:
```typescript
{t('common:welcome')}  // Use namespace:key format
```

### 6. Date and Number Formatting

For date and number formatting, use libraries like `date-fns` with locale support:

```typescript
import { format } from 'date-fns';
import { hi, ta, te } from 'date-fns/locale';

const locales = { hi, ta, te };
const { i18n } = useT();
const locale = locales[i18n.language] || en;

format(new Date(), 'PPpp', { locale });
```

### 7. RTL (Right-to-Left) Support

If you need to support RTL languages in the future, you can detect and apply RTL classes:

```typescript
const { i18n } = useT();
const isRTL = ['ar', 'he', 'ur'].includes(i18n.language);

<div className={isRTL ? 'rtl' : 'ltr'}>
  {/* Content */}
</div>
```

---

## Troubleshooting

### Issue: Translations not updating

**Solution:** Make sure you've imported the i18n config in `main.tsx`:
```typescript
import './i18n/config';
```

### Issue: Language not persisting after page reload

**Solution:** Check that `i18next-browser-languagedetector` is properly configured with localStorage caching.

### Issue: Missing translations showing as keys

**Solution:** 
1. Check that the translation key exists in all language files
2. Verify the JSON structure is valid
3. Check browser console for JSON parsing errors

### Issue: TypeScript errors with translation keys

**Solution:** Create type definitions for translation keys:

```typescript
// src/i18n/types.ts
import 'react-i18next';
import enTranslations from './locales/en/translation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enTranslations;
    };
  }
}
```

Then import in `config.ts`:
```typescript
import './types';
```

### Issue: Language selector not working

**Solution:**
1. Verify `i18n.changeLanguage()` is being called
2. Check that the language key matches exactly (case-sensitive)
3. Ensure the translation file for that language exists

---

## Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Browser Language Detector](https://github.com/i18next/i18next-browser-languagedetector)

---

## Quick Reference

### Common Translation Keys Structure

```json
{
  "common": {
    "welcome": "...",
    "home": "...",
    "about": "...",
    "services": "...",
    "contact": "...",
    "login": "...",
    "register": "...",
    "logout": "...",
    "dashboard": "...",
    "profile": "...",
    "settings": "...",
    "search": "...",
    "submit": "...",
    "cancel": "...",
    "save": "...",
    "delete": "...",
    "edit": "...",
    "back": "...",
    "next": "...",
    "previous": "...",
    "loading": "...",
    "error": "...",
    "success": "..."
  },
  "auth": {
    "email": "...",
    "password": "...",
    "confirmPassword": "...",
    "forgotPassword": "...",
    "rememberMe": "...",
    "signIn": "...",
    "signUp": "...",
    "firstName": "...",
    "lastName": "...",
    "phone": "...",
    "alreadyHaveAccount": "...",
    "dontHaveAccount": "..."
  },
  "services": {
    "title": "...",
    "bookNow": "...",
    "viewDetails": "...",
    "puja": "...",
    "astrology": "...",
    "consultation": "..."
  },
  "pandit": {
    "title": "...",
    "bookPandit": "...",
    "experience": "...",
    "years": "...",
    "specialization": "...",
    "languages": "..."
  },
  "booking": {
    "title": "...",
    "selectDate": "...",
    "selectTime": "...",
    "totalAmount": "...",
    "confirmBooking": "..."
  }
}
```

---

## Summary

This guide provides a complete implementation of multi-language support for your MantraSetu application. The key steps are:

1. ✅ Install dependencies (already done)
2. ✅ Create i18n configuration
3. ✅ Create translation files for all languages
4. ✅ Initialize i18n in main.tsx
5. ✅ Update LanguageSelector component
6. ✅ Use translations in components

Follow the examples and best practices outlined in this guide to implement translations throughout your application.

