import { useState } from 'react';
import { translations } from '../data/translations';

export function useLang() {
  const [lang, setLang] = useState(
    () => localStorage.getItem('portfolio-lang') || 'en'
  );
  
  const t = translations[lang];
  
  const toggleLang = () => setLang(l => {
    const next = l === 'en' ? 'de' : 'en';
    localStorage.setItem('portfolio-lang', next);
    return next;
  });
  
  return { lang, t, toggleLang };
}
