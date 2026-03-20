import { useState, useEffect } from 'react';

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
        }, { rootMargin: '-30% 0px -70% 0px' });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return activeSection;
}
