import React, { useState, createContext } from 'react';
import { createPortal } from 'react-dom';
import { useActiveSection } from './hooks/useActiveSection';

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
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AIAssistantSection } from './components/sections/AIAssistantSection';
import { CertificationsSection } from './components/sections/CertificationsSection';
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';

export const ThemeContext = createContext({ isDark: true, setIsDark: () => {} });

export default function App() {
    const [isDark, setIsDark] = useState(true);
    const activeSection = useActiveSection();

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen font-sans transition-colors duration-500 relative`}>
                {/* Render ParticleField globally using React Portal */}
                {createPortal(<ParticleField />, document.body)}

                <Header activeSection={activeSection} />
                
                <main>
                    <Hero />
                    <div className="section-divider"></div>
                    <CareerRoadmapSection />
                    <div className="section-divider"></div>
                    <SkillsSection />
                    <div className="section-divider"></div>
                    <ProjectsSection />
                    <div className="section-divider"></div>
                    <AIAssistantSection />
                    <div className="section-divider"></div>
                    <CertificationsSection />
                    <div className="section-divider"></div>
                    <BlogSection />
                    <div className="section-divider"></div>
                    <ContactSection />
                </main>

                <Footer />
                <ScrollToTop />
                <AvatarGuide />
            </div>
        </ThemeContext.Provider>
    );
}
