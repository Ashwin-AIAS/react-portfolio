export const translations = {
  en: {
    nav: {
      roadmap: "Roadmap",
      skills: "Skills",
      projects: "Projects",
      assistant: "Assistant",
      certifications: "Certifications",
      contact: "Contact",
      cv: "Resume"
    },
    hero: {
      badge: "AI Engineer for Autonomous Systems",
      greeting: "Hi, I'm",
      bio: "Master's student in AI Engineering for Autonomous Systems at THI Germany, specializing in Computer Vision, Deep Learning perception, and LLM/RAG systems. Experienced in deploying real-time vision pipelines and edge inference. Actively seeking roles as a Computer Vision Engineer, AI Engineer, or Autonomous Driving / Perception Engineer.",
      downloadCv: "Download CV",
      previewCv: "Preview CV",
      viewProjects: "View Projects",
      getInTouch: "Get in Touch",
      startAudioTour: "Start Audio Tour",
      audioTourActive: "Audio Tour Active",
      askAssistant: "Ask AI Assistant",
      statement: "I teach machines to see.",
      // The word the statement scene lights up; must appear in `statement`.
      statementAccent: "see.",
      statementSub: "Perception, sensor fusion and LLM systems for vehicles that drive themselves.",
      scrollCue: "Scroll",
      recruiterFacts: [
        { label: "Target Roles", value: "Computer Vision • ADAS Perception • GenAI" },
        { label: "Availability", value: "Full-Time • Working Student • Thesis" },
        { label: "Location", value: "Ingolstadt, DE (Munich / EU / Remote)" },
        { label: "Experience", value: "2+ Yrs Enterprise IT (DXC)" }
      ]
    },
    roadmap: {
      title: "Career Roadmap",
      subtitle: "Education & professional experience",
      previewPaper: "Preview Paper",
      downloadPaper: "Download Paper",
      tags: { education: "Education", work: "Work" }
    },
    skills: {
      title: "Skills",
      subtitle: "Technologies & tools I work with",
      stats: {
        projects: "Projects",
        certifications: "Certifications",
        experience: "Years Exp"
      }
    },
    sandbox: {
      eyebrow: "Interactive In-Browser AI Micro-Playground",
      title: "Live Edge Inference & Sensor Fusion Telemetry",
      subtitle: "Zero-backend client-side execution: test symmetric Int8 weight quantization and Im2Col memory unrolling, or stress-test a real-time LiDAR + RADAR Kalman tracker.",
      cnnTab: "Edge CNN Quantization & Im2Col",
      fusionTab: "LiDAR + RADAR Kalman Sensor Fusion"
    },
    projects: {
      title: "Projects",
      subtitle: "Featured work & technical explorations",
      showMore: "Show all projects",
      showLess: "Show fewer projects",
      architectureBtn: "Architecture & Benchmarks",
      closeArchitecture: "Close",
      pipelineTitle: "System Dataflow Pipeline",
      problemTitle: "Engineering Bottleneck",
      tradeoffTitle: "Architectural Trade-Off & Solution",
      highlightsTitle: "Implementation Highlights",
      benchmarksTitle: "Verified System Telemetry",
      filterAll: "All Deployments"
    },
    assistant: {
      title: "Talk to my Portfolio",
      subtitle: "Ask about my background, skills, and projects, or paste a job description for a fit analysis",
      badge: "AI Powered",
      cardTitle: "Technical Match Analysis",
      placeholder: "Ask about Ashwin or paste a JD for fit analysis...",
      button: "Ask AI",
      generating: "Analyzing Match...",
      reportLabel: "Candidate Fit Report",
      disclaimer: "This report is an automated technical evaluation based on the candidate's verified portfolio data.",
      initialMessage: "Hi! I'm Ashwin's AI assistant. Paste a job description for a fit analysis, or ask me anything about his background and projects.",
      presetLabel: "Instant Recruiter JD Fit Presets:",
      privacyNote: "Messages and voice audio are processed by Google Gemini (free tier) and may be used by Google to improve its products. Don't share sensitive info.",
      privacyLink: "Privacy"
    },
    certifications: {
      title: "Certifications",
      subtitle: "Professional credentials & continuous learning",
      viewCredential: "View Credential"
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Let's connect and build something great",
      email: "Email",
      phone: "Phone",
      location: "Location",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Something went wrong. Please try again."
    },
    github: {
      title: "GitHub Activity",
      subtitle: "Open source contributions & coding consistency",
      contributions: "contributions in the last year",
      less: "Less",
      more: "More",
      totalCommits: "Total Commits",
      currentStreak: "Current Streak",
      topLanguage: "Top Language",
      days: "days"
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy"
    },
    privacy: {
      title: "Privacy",
      subtitle: "What happens to your data on this site, in plain language",
      updated: "Last updated: November 2026",
      items: [
        {
          heading: "AI assistant (chat and voice)",
          body: [
            "Your chat messages, and in voice mode your microphone audio, are sent to Google's Gemini API to generate replies. Text goes through this site's server; voice is streamed directly from your browser to Google once the microphone is on.",
            "This site uses Gemini's free tier. Under Google's terms for unpaid services, Google may use what you send, and the replies, to improve its products, and human reviewers may read it. Please don't share personal, confidential or sensitive information.",
            "This site doesn't store your messages or audio, and doesn't write them to its logs. The conversation only lives in your open browser tab."
          ]
        },
        {
          heading: "Abuse protection (rate limiting)",
          body: [
            "To stop abuse and keep the AI features free to run, requests to them are counted per visitor. Your IP address is combined with a secret value and hashed (SHA-256). Only this hash is stored, in Upstash Redis, and every entry expires automatically within 24 hours.",
            "The hash also appears in short-lived server logs with the time, the endpoint and the response status. A hashed IP is pseudonymous data, which still counts as personal data under the GDPR."
          ]
        },
        {
          heading: "Hosting",
          body: [
            "The site is hosted on Vercel; its server functions run in Frankfurt (EU). Like any web host, Vercel processes technical request data such as your IP address in order to deliver the site."
          ]
        },
        {
          heading: "Contact form",
          body: [
            "Messages sent through the contact form are delivered to my inbox by Formspree (formspree.io), which processes your name, email address and message for that purpose."
          ]
        },
        {
          heading: "Third-party content",
          body: [
            "Fonts are loaded from Google Fonts, the GitHub section from GitHub and a GitHub contributions service, skill icons from Simple Icons, and a project demo video from Vercel Blob. Loading them reveals your IP address to those services."
          ]
        },
        {
          heading: "Cookies and local storage",
          body: [
            "No cookies and no analytics or tracking. Your theme, language and voice-guide settings are saved in your browser's local storage and never leave your device."
          ]
        }
      ],
      contact: "Questions about your data, or want something removed? Email me at",
      googleTerms: "Gemini API terms",
      googlePrivacy: "Google Privacy Policy"
    }
  },
  de: {
    nav: {
      roadmap: "Werdegang",
      skills: "Fähigkeiten",
      projects: "Projekte",
      assistant: "Assistent",
      certifications: "Zertifikate",
      contact: "Kontakt",
      cv: "Lebenslauf"
    },
    hero: {
      badge: "KI-Ingenieur für Autonome Systeme",
      greeting: "Hallo, ich bin",
      bio: "Masterstudent im Bereich KI-Engineering für Autonome Systeme an der THI, spezialisiert auf Computer Vision, Deep Learning Perception und LLM/RAG-Systeme. Erfahren in der Bereitstellung von Echtzeit-Vision-Pipelines und Edge-Inferenz. Aktiv auf der Suche nach Positionen als Computer Vision Engineer, KI-Ingenieur oder Perception / Autonomous Driving Engineer.",
      downloadCv: "CV Herunterladen",
      previewCv: "CV Vorschau",
      viewProjects: "Projekte ansehen",
      getInTouch: "Kontakt aufnehmen",
      startAudioTour: "Audio-Tour starten",
      audioTourActive: "Audio-Tour aktiv",
      askAssistant: "KI-Assistent fragen",
      statement: "Ich bringe Maschinen das Sehen bei.",
      statementAccent: "Sehen",
      statementSub: "Perception, Sensorfusion und LLM-Systeme für Fahrzeuge, die selbst fahren.",
      scrollCue: "Scrollen",
      recruiterFacts: [
        { label: "Zielrollen", value: "Computer Vision • ADAS Perception • GenAI" },
        { label: "Vertragsart", value: "Vollzeit • Werkstudent • Masterarbeit" },
        { label: "Standort", value: "Ingolstadt, DE (München / EU / Remote)" },
        { label: "Erfahrung", value: "2+ J. Enterprise IT (DXC)" }
      ]
    },
    roadmap: {
      title: "Werdegang",
      subtitle: "Ausbildung & Berufserfahrung",
      previewPaper: "Paper ansehen",
      downloadPaper: "Paper herunterladen",
      tags: { education: "Ausbildung", work: "Arbeit" }
    },
    skills: {
      title: "Fähigkeiten",
      subtitle: "Technologien & Tools",
      stats: {
        projects: "Projekte",
        certifications: "Zertifikate",
        experience: "Jahre Erfahrung"
      }
    },
    sandbox: {
      eyebrow: "Interaktives In-Browser KI-Labor",
      title: "Live Edge-Inferenz & Sensorfusion-Telemetrie",
      subtitle: "Clientseitige Echtzeit-Ausführung: Teste symmetrische Int8-Quantisierung und Im2Col-Speicherlayout oder simuliere einen LiDAR + RADAR Kalman-Tracker unter Wetterstress.",
      cnnTab: "Edge CNN Quantisierung & Im2Col",
      fusionTab: "LiDAR + RADAR Kalman-Sensorfusion"
    },
    projects: {
      title: "Projekte",
      subtitle: "Ausgewählte Arbeiten & technische Entwicklungen",
      showMore: "Alle Projekte anzeigen",
      showLess: "Weniger anzeigen",
      architectureBtn: "Architektur & Benchmarks",
      closeArchitecture: "Schließen",
      pipelineTitle: "System-Datenfluss-Pipeline",
      problemTitle: "Technischer Engpass",
      tradeoffTitle: "Architektur-Abwägung & Lösung",
      highlightsTitle: "Implementierungs-Highlights",
      benchmarksTitle: "Verifizierte System-Telemetrie",
      filterAll: "Alle Projekte"
    },
    assistant: {
      title: "Sprich mit meinem Portfolio",
      subtitle: "Frag nach meinem Hintergrund, Fähigkeiten und Projekten oder füge eine Stellenbeschreibung für eine Analyse ein",
      badge: "KI-gestützt",
      cardTitle: "Technische Übereinstimmungsanalyse",
      placeholder: "Frag nach Ashwin oder füg eine Stellenbeschreibung ein...",
      button: "Analysebericht erstellen",
      generating: "Analyse läuft...",
      reportLabel: "Kandidaten-Analysebericht",
      disclaimer: "Dieser Bericht ist eine automatisierte technische Bewertung auf Basis des verifizierten Portfolios.",
      initialMessage: "Hallo! Ich bin Ashwins KI-Assistent. Füge eine Stellenbeschreibung ein oder stelle mir Fragen zu seinem Hintergrund und seinen Projekten.",
      presetLabel: "Sofort-Analyse für Beispiel-Stellenprofile:",
      privacyNote: "Nachrichten und Sprachaufnahmen werden von Google Gemini (kostenlose Stufe) verarbeitet und können von Google zur Verbesserung seiner Produkte genutzt werden. Bitte keine sensiblen Daten teilen.",
      privacyLink: "Datenschutz"
    },
    certifications: {
      title: "Zertifikate",
      subtitle: "Professionelle Nachweise & kontinuierliches Lernen",
      viewCredential: "Zertifikat anzeigen"
    },
    contact: {
      title: "Kontakt aufnehmen",
      subtitle: "Lass uns verbinden und etwas Großartiges aufbauen",
      email: "E-Mail",
      phone: "Telefon",
      location: "Standort",
      namePlaceholder: "Name",
      emailPlaceholder: "E-Mail",
      subjectPlaceholder: "Betreff",
      messagePlaceholder: "Nachricht",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Nachricht erfolgreich gesendet!",
      error: "Etwas ist schiefgelaufen. Bitte erneut versuchen."
    },
    github: {
      title: "GitHub-Aktivität",
      subtitle: "Open-Source-Beiträge & Coding-Konstanz",
      contributions: "Beiträge im letzten Jahr",
      less: "Weniger",
      more: "Mehr",
      totalCommits: "Commits gesamt",
      currentStreak: "Aktuelle Serie",
      topLanguage: "Top-Sprache",
      days: "Tage"
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      privacy: "Datenschutz"
    },
    privacy: {
      title: "Datenschutz",
      subtitle: "Was mit deinen Daten auf dieser Website passiert, in einfachen Worten",
      updated: "Stand: November 2026",
      items: [
        {
          heading: "KI-Assistent (Chat und Sprache)",
          body: [
            "Deine Chat-Nachrichten und im Sprachmodus deine Mikrofonaufnahme werden an die Gemini API von Google gesendet, um Antworten zu erzeugen. Text läuft über den Server dieser Website; Sprache wird, sobald das Mikrofon an ist, direkt von deinem Browser zu Google übertragen.",
            "Diese Website nutzt die kostenlose Stufe von Gemini. Nach Googles Bedingungen für kostenlose Dienste kann Google deine Eingaben und die Antworten zur Verbesserung seiner Produkte nutzen, und menschliche Prüfer können sie lesen. Bitte teile keine persönlichen, vertraulichen oder sensiblen Informationen.",
            "Diese Website speichert deine Nachrichten und Aufnahmen nicht und schreibt sie nicht in ihre Logs. Das Gespräch existiert nur in deinem geöffneten Browser-Tab."
          ]
        },
        {
          heading: "Schutz vor Missbrauch (Rate Limiting)",
          body: [
            "Um Missbrauch zu verhindern und die KI-Funktionen kostenlos betreiben zu können, werden Anfragen pro Besucher gezählt. Deine IP-Adresse wird mit einem geheimen Wert kombiniert und gehasht (SHA-256). Gespeichert wird nur dieser Hash, in Upstash Redis, und jeder Eintrag läuft innerhalb von 24 Stunden automatisch ab.",
            "Der Hash erscheint außerdem zusammen mit Zeit, Endpunkt und Antwortstatus in kurzlebigen Server-Logs. Eine gehashte IP ist ein pseudonymes Datum und gilt nach der DSGVO weiterhin als personenbezogenes Datum."
          ]
        },
        {
          heading: "Hosting",
          body: [
            "Die Website wird bei Vercel gehostet; die Serverfunktionen laufen in Frankfurt (EU). Wie jeder Webhoster verarbeitet Vercel technische Anfragedaten wie deine IP-Adresse, um die Website auszuliefern."
          ]
        },
        {
          heading: "Kontaktformular",
          body: [
            "Nachrichten über das Kontaktformular werden von Formspree (formspree.io) an mein Postfach zugestellt. Formspree verarbeitet dafür deinen Namen, deine E-Mail-Adresse und deine Nachricht."
          ]
        },
        {
          heading: "Inhalte von Drittanbietern",
          body: [
            "Schriftarten werden von Google Fonts geladen, der GitHub-Bereich von GitHub und einem Dienst für GitHub-Beiträge, Skill-Icons von Simple Icons und ein Projekt-Demovideo von Vercel Blob. Beim Laden erfahren diese Dienste deine IP-Adresse."
          ]
        },
        {
          heading: "Cookies und lokaler Speicher",
          body: [
            "Keine Cookies, keine Analyse- oder Tracking-Tools. Deine Einstellungen für Design, Sprache und Sprachführung werden im lokalen Speicher deines Browsers gespeichert und verlassen dein Gerät nicht."
          ]
        }
      ],
      contact: "Fragen zu deinen Daten oder soll etwas gelöscht werden? Schreib mir an",
      googleTerms: "Nutzungsbedingungen der Gemini API",
      googlePrivacy: "Datenschutzerklärung von Google"
    }
  }
};
