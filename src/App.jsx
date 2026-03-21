import React, { useState, createContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useActiveSection } from './hooks/useActiveSection';
import { useLang } from './hooks/useLang';

// UI Components
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { ParticleField } from './components/ui/ParticleField';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AvatarGuide } from './components/ui/AvatarGuide';

// Section Components
import { Hero } from './components/sections/Hero';
import { CareerRoadmapSection } from './components/sections/CareerRoadmapSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { GitHubSection } from './components/sections/GitHubSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AIAssistantSection } from './components/sections/AIAssistantSection';
import { CertificationsSection } from './components/sections/CertificationsSection';
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';

export const ThemeContext = createContext({ isDark: true, setIsDark: () => {} });

export default function App() {
    const [isDark, setIsDark] = useState(true);
    const activeSection = useActiveSection();
    const { lang, t, toggleLang } = useLang();

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen font-sans transition-colors duration-500 relative`}>
                {/* Render ParticleField globally using React Portal */}
                {createPortal(<ParticleField />, document.body)}

                <Header activeSection={activeSection} lang={lang} t={t} toggleLang={toggleLang} />
                
                <main>
                    <Hero t={t} />
                    <div className="section-divider"></div>
                    <CareerRoadmapSection t={t} />
                    <div className="section-divider"></div>
                    <SkillsSection t={t} />
                    <div className="section-divider"></div>
                    <GitHubSection t={t} />
                    <div className="section-divider"></div>
                    <ProjectsSection t={t} />
                    <div className="section-divider"></div>
                    <AIAssistantSection t={t} />
                    <div className="section-divider"></div>
                    <CertificationsSection t={t} />
                    <div className="section-divider"></div>
                    <BlogSection />
                    <div className="section-divider"></div>
                    <ContactSection t={t} />
                </main>

                <Footer t={t} />
                <ScrollToTop />
                <AvatarGuide />
            </div>
        </ThemeContext.Provider>
    );
}
