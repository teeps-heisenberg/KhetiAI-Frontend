# KhetiAI Internationalization (i18n)

This directory contains the internationalization setup for KhetiAI, supporting both English and Urdu languages.

## Features

- **Language Switching**: Users can switch between English (en) and Urdu (ur) using the language switcher in the header
- **RTL Support**: Automatic right-to-left (RTL) layout when Urdu is selected
- **Voice Recognition**: Speech recognition adapts to the selected language (en-US or ur-PK)
- **Persistent Language**: Selected language is stored in browser localStorage

## Structure

```
src/i18n/
├── i18n.ts              # i18next configuration
├── locales/
│   ├── en.json         # English translations
│   └── ur.json         # Urdu translations
└── README.md           # This file
```

## Adding New Translations

### 1. Add to English (en.json)

```json
{
  "newSection": {
    "key": "English text here"
  }
}
```

### 2. Add to Urdu (ur.json)

```json
{
  "newSection": {
    "key": "اردو متن یہاں"
  }
}
```

### 3. Use in Components

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <p>{t("newSection.key")}</p>;
}
```

## Supported Languages

| Language | Code | Locale | Direction |
| -------- | ---- | ------ | --------- |
| English  | en   | en-US  | LTR       |
| Urdu     | ur   | ur-PK  | RTL       |

## Voice Recognition Support

The voice interface automatically adjusts the speech recognition language based on the selected UI language:

- **English**: Uses `en-US` locale for speech recognition
- **Urdu**: Uses `ur-PK` locale for speech recognition

## RTL (Right-to-Left) Support

When Urdu is selected:

- The entire layout automatically switches to RTL
- Urdu font (Noto Nastaliq Urdu) is applied
- Navigation and UI elements are mirrored appropriately
- The `dir` attribute on the HTML element is updated

## Browser Compatibility

The language feature works best in:

- Chrome (recommended for voice recognition)
- Edge
- Firefox (text-only, voice may be limited)
- Safari (text-only, voice may be limited)

## Future Enhancements

- Add more languages (Hindi, Punjabi, etc.)
- Text-to-speech for AI responses
- Language auto-detection based on user's browser settings
- Offline support for translations

