// Example translation function
const translations = {
  Hello: {
    en: 'Hello',
    fr: 'Bonjour',
    es: 'Hola',
  },
  // Other translations...
};

const t = (key, locale = 'fr') => {
  // Look up the translation for the key and locale
  const translation = translations[key];
  if (translation) {
    const translatedText = translation[locale];
    if (translatedText) {
      return translatedText;
    }
  }
  // Fallback: return the original text if no translation is found
  return key;
};

// Example usage
console.log(t('Hello')); // Output depends on the locale
