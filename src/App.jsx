import React, { useState, useEffect, useRef } from 'react';

// --- PERSONALIZED DATA ---  
const portfolioData = {
  personalInfo: {
    name: "Ashwin",
    title: "AI Engineer for Autonomous Systems",
    bio: "Aspiring AI Engineer with a background in ERP analysis and a passion for autonomous systems. Experienced in developing automation scripts, managing data, and working on cutting-edge computer vision and generative AI projects. Currently pursuing a Master's in AI Engineering.",
    email: "mashwinvignesh@gmail.com",
    phone: "+49 15560090137",
    location: "Ingolstadt, Germany",
    github: "https://github.com/Ashwin-AIAS",
    linkedin: "https://linkedin.com/in/ashwin-vignesh-m-902344212",
    resumeUrl: "https://drive.google.com/file/d/19W761Zx-8MJwUifXZEgeyx-8fA_mZSgJ/view?usp=sharing"
  },
  careerRoadmap: [
    {
      type: 'education',
      title: "B.Tech in Mechanical Engineering",
      institution: "Reva University, Bengaluru, India",
      period: "2018 - 2022",
      details: "• Key Project: Development of an Automated Hydroponic Plant Grow System using Arduino and computer vision (OpenCV).\n• Published a paper on the project at the 4th National Conference on New Trends in Mechanical Engineering (NCNTME-2022).",
      paperUrl: "https://drive.google.com/file/d/1quhbB8EjNY-0763xEIUO81fEDs_fX9Kc/view?usp=sharing"
    },
    {
      type: 'work',
      title: "Analyst II ERP Package Applications",
      institution: "DXC Technology, India",
      period: "Sep 2022 - Apr 2024",
      details: "• Provided technical support for key client AT&T.\n• Utilized ticketing tools like ServiceNow for incident management.\n• Built Power BI dashboards to monitor KPIs and performance metrics.\n• Automated workflow processes using Power Automate, enhancing productivity."
    },
    {
      type: 'education',
      title: "Masters in AI Engineering for Autonomous Systems",
      institution: "Technische Hochschule Ingolstadt, Germany",
      period: "Mar 2024 - Present",
      details: "Relevant coursework: Machine Learning, Deep Learning, Data Engineering, Sensor Data and Fusion (automotive-focused)."
    }
  ],
  skills: {
    "Programming & Tools": ["Python", "SQL", "Power Automate", "Simulink", "SUMO", "Pandas", "NumPy"],
    "AI/ML": ["PyTorch", "Keras", "TensorFlow", "OpenCV", "Reinforcement Learning", "Prompt Engineering"],
    "Data Analysis & Visualization": ["Power BI", "Excel", "Tableau"],
    "Collaboration": ["SharePoint", "Confluence", "Jira", "GitHub"],
  },
  projects: [
    {
      title: "Foundation Models for Computer Vision",
      description: "• Advanced camera-LiDAR fusion models.\n• Led the setup of a development environment on Jetson Nano.\n• Performed data preprocessing for large-scale Kitty and Waymo datasets.\n• Utilized Git and Jira for collaborative project management.",
      technologies: ["Python", "PyTorch", "Keras", "OpenCV", "Jetson Nano", "Git", "Jira"],
      visualComponent: 'LidarFusion',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
    {
      title: "Generative AI for Synthetic Sensor Data",
      description: "• Developed data generation pipelines using Generative Adversarial Networks (GANs).\n• Produced rare and complex visual scenarios to augment training data.\n• Improved dataset diversity and overall model robustness.",
      technologies: ["Python", "GANs", "PyTorch", "Keras"],
      visualComponent: 'GenerativeAI',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
    {
      title: "Coordination of Automated Vehicles at Roundabouts",
      description: "• Conducted competitive and scenario analysis to evaluate various mobility strategies.\n• Contributed to roadmap recommendations for advanced traffic systems.\n• Utilized SUMO and Simulink for traffic flow simulation.",
      technologies: ["SUMO", "Simulink", "Python", "Scenario Analysis"],
      visualComponent: 'Roundabout',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
    {
      title: "Custom RL Environment: 'Road to Mr. Olympia 2024'",
      description: "• Developed AI agents using reinforcement learning (Q-Learning, PPO).\n• Simulated complex, multi-stage decision-making in a custom Python environment.\n• Focused on optimizing long-term rewards.",
      technologies: ["Python", "Reinforcement Learning", "Q-Learning", "PPO"],
      visualComponent: 'ReinforcementLearning',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    }
  ],
  certifications: [
    {
      name: "Building Code Agents with Hugging Face",
      issuer: "Hugging Face",
      credentialUrl: "https://learn.deeplearning.ai/accomplishments/240265ce-9dc1-4253-8cfb-34875b205d33?usp=sharing"
    },
    {
      name: "Intro to Deep learning",
      issuer: "Kaggle",
      credentialUrl: "https://www.kaggle.com/learn/certification/ashwinvigneshm/intro-to-deep-learning"
    },
    {
      name: "Transformer-Based Natural Language Processing",
      issuer: "Coursera",
      credentialUrl: "https://learn.nvidia.com/certificates?id=n-bm0zFoTnigmiwDZdSKnw#"
    },
    {
      name: "Prompt Engineering for ChatGPT",
      issuer: "Vanderbilt University",
      credentialUrl: "https://www.mygreatlearning.com/certificate/SLUQCJZG"
    },
    {
      name: "Python for Beginners",
      issuer: "Udemy / Sololearn",
      credentialUrl: "https://ude.my/UC-f81110b8-48cb-49bb-8e5f-a2e9369a517f"
    }
  ]
};

// --- GEMINI API CALLER ---
const callGeminiAPI = async (userQuery, systemPrompt) => {
    // We check for the Vercel/Vite environment variable safely to avoid build warnings
    let apiKey = "";
    try {
        // String literal access prevents compiler from crashing if import.meta is missing
        apiKey = import.meta.env["VITE_GEMINI_API_KEY"] || "";
    } catch (e) {
        apiKey = "";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    // Mandatory Exponential Backoff Retry Logic
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) throw new Error("No analysis generated.");
                return text;
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error("Missing or Invalid API Key. Ensure VITE_GEMINI_API_KEY is set in Vercel settings.");
            }

            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            if (i === maxRetries - 1 || error.message.includes("API Key")) throw error;
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("The AI service is currently busy. Please try again.");
};

// --- ICONS ---
const GitHubIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>);
const LinkedInIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const ExternalLinkIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);
const DownloadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const SparklesIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5a2.5 2.5 0 0 1 5 0m-2.5 5a2.5 2.5 0 0 1 5 0m-5 5a2.5 2.5 0 0 1 5 0m-2.5 5a2.5 2.5 0 0 1 5 0M2.5 9.5a2.5 2.5 0 0 1 0-5m5 2.5a2.5 2.5 0 0 1 0-5m5 5a2.5 2.5 0 0 1 0-5m5 2.5a2.5 2.5 0 0 1 0-5m-5 15a2.5 2.5 0 0 1 0-5m-5 2.5a2.5 2.5 0 0 1 0-5m-2.5-2.5a2.5 2.5 0 0 1 0-5" /></svg>);
const BotIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>);
const MailIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const PhoneIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
const MapPinIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const SendIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>);
const BriefcaseIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>);
const GraduationCapIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.7.7 3.2 2 4"></path><path d="M18 12v5a2.2 2.2 0 0 1-2 2.7"></path></svg>);

// --- VISUAL COMPONENTS ---
const LidarFusionVisual = () => (
    <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes lidar-scan {
                0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
            }
            .lidar-point {
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: #06b6d4;
                border-radius: 50%;
                animation: lidar-scan 1.5s ease-out infinite;
            }
        `}</style>
        <div className="absolute top-1/2 left-4 w-0 h-0 border-t-[40px] border-t-transparent border-b-[40px] border-b-transparent border-l-[60px] border-l-cyan-500/10 -translate-y-1/2"></div>
        <svg viewBox="0 0 100 40" className="w-4/6 h-auto z-10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5">
            <path d="M 5,25 C 5,20 10,20 15,20 L 25,15 C 30,10 40,10 50,12 L 70,12 C 80,12 85,20 90,25 C 95,30 95,30 95,30 L 5,30 C 5,30 5,30 5,25 Z" />
            <circle cx="20" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
            <circle cx="80" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
        </svg>
        <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full z-20 shadow-[0_0_10px_#06b6d4]"></div>
        <div className="absolute top-1/2 left-4 w-3 h-3 bg-blue-400 rounded-full z-20 shadow-[0_0_10px_#3b82f6] -translate-y-1/2"></div>
        {[...Array(20)].map((_, i) => {
            const targets = [{ x: '15px', y: '10px' }, { x: '25px', y: '-5px' }, { x: '40px', y: '-10px' }, { x: '60px', y: '-8px' }, { x: '80px', y: '5px' }, { x: '90px', y: '15px' }, { x: '80px', y: '20px' }, { x: '20px', y: '20px' }];
            const target = targets[i % targets.length];
            return (<div key={i} className="lidar-point" style={{ top: '16px', left: '16px', '--tx': target.x, '--ty': target.y, animationDelay: `${i * 0.08}s` }} ></div>);
        })}
    </div>
);

const GenerativeAIVisual = () => {
    const [dots, setDots] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => [...d, { x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }].slice(-15));
        }, 300);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center">
            <style>{`
                @keyframes radar-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .radar-sweep::after { content: ''; position: absolute; left: 50%; top: 0; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(96, 165, 250, 0.2)); }
                @keyframes dot-fade-in { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
                .synthetic-dot { animation: dot-fade-in 0.5s ease-out; }
            `}</style>
            <div className="absolute w-[200%] h-[200%] rounded-full radar-sweep" style={{ animation: 'radar-sweep 4s linear infinite' }}></div>
            {dots.map((dot, i) => (
                <div key={i} className="absolute w-2 h-2 bg-blue-400 rounded-full synthetic-dot shadow-[0_0_8px_#60a5fa]" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}></div>
            ))}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
    );
};

const RLVisual = () => (
    <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center p-4">
        <style>{`
            @keyframes agent-move { 0%, 20% { top: 12.5%; left: 12.5%; } 35% { top: 12.5%; left: 37.5%; } 50% { top: 37.5%; left: 37.5%; } 65% { top: 37.5%; left: 62.5%; } 80%, 100% { top: 62.5%; left: 62.5%; } }
            .rl-agent { animation: agent-move 5s ease-in-out infinite; }
        `}</style>
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full max-w-[152px] max-h-[152px]">
            {[...Array(16)].map((_, i) => (<div key={i} className="w-full h-full bg-gray-700/50 rounded-sm"></div>))}
        </div>
        <div className="absolute w-[12.5%] h-[12.5%] top-[62.5%] left-[62.5%] flex items-center justify-center text-2xl">🏆</div>
        <div className="absolute w-[12.5%] h-[12.5%] bg-amber-400 rounded-full rl-agent shadow-[0_0_10px_#f59e0b]"></div>
    </div>
);

const RoundaboutVisual = () => (
    <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes drive-around-1 { 0% { transform: rotate(0deg) translateX(55px) rotate(-0deg); } 100% { transform: rotate(360deg) translateX(55px) rotate(-360deg); } }
            @keyframes drive-around-2 { 0% { transform: rotate(120deg) translateX(55px) rotate(-120deg); } 100% { transform: rotate(480deg) translateX(55px) rotate(-480deg); } }
            @keyframes drive-around-3 { 0% { transform: rotate(240deg) translateX(55px) rotate(-240deg); } 100% { transform: rotate(600deg) translateX(55px) rotate(-600deg); } }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); } 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); } }
            .car { animation-timing-function: linear; animation-iteration-count: infinite; }
            .car-1 { animation-name: drive-around-1; animation-duration: 8s; }
            .car-2 { animation-name: drive-around-2; animation-duration: 8s; }
            .car-3 { animation-name: drive-around-3; animation-duration: 8s; }
            .wifi-pulse { animation: pulse 2s infinite; }
        `}</style>
        <div className="w-40 h-40 absolute">
            <div className="absolute w-full h-6 bg-gray-600 top-1/2 -translate-y-1/2"></div>
            <div className="absolute h-full w-6 bg-gray-600 left-1/2 -translate-x-1/2"></div>
            <div className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full border-4 border-gray-600"></div>
            <div className="absolute w-full h-full top-0 left-0">
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-red-500 rounded-sm car car-1"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-blue-500 rounded-sm car car-2"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-yellow-500 rounded-sm car car-3"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
            </div>
        </div>
    </div>
);

const AIAssistantVisual = ({ isGenerating }) => (
    <div className="w-full h-24 bg-gray-900/50 rounded-t-lg p-4 relative overflow-hidden">
        <style>{`
            @keyframes scan-glow { 0% { box-shadow: 0 0 5px 2px rgba(6, 182, 212, 0.5); } 50% { box-shadow: 0 0 15px 5px rgba(6, 182, 212, 0.8); } 100% { box-shadow: 0 0 5px 2px rgba(6, 182, 212, 0.5); } }
            @keyframes scanner-move { 0% { top: -10px; } 100% { top: 100%; } }
        `}</style>
        <div className="space-y-2">
            <div className="w-3/4 h-2 bg-gray-700 rounded-full"></div>
            <div className="w-full h-2 bg-gray-700 rounded-full"></div>
            <div className="w-1/2 h-2 bg-gray-700 rounded-full"></div>
            <div className="w-5/6 h-2 bg-gray-700 rounded-full"></div>
        </div>
        {isGenerating && (
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute left-0 w-full h-1 bg-cyan-400 scanner-line" style={{ animation: 'scanner-move 1.5s linear infinite, scan-glow 1.5s ease-in-out infinite' }}></div>
            </div>
        )}
    </div>
);

// --- SKILL BADGE ---
const SkillBadge = ({ skillName }) => {
    const badgeMap = {
        Python: 'https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54',
        SQL: 'https://img.shields.io/badge/SQL-025E8C?style=for-the-badge&logo=microsoft-sql-server&logoColor=white',
        'Power Automate': 'https://img.shields.io/badge/Power%20Automate-0066FF?style=for-the-badge&logo=powerautomate&logoColor=white',
        Simulink: 'https://img.shields.io/badge/Simulink-D9230F?style=for-the-badge&logo=simulink&logoColor=white',
        SUMO: 'https://img.shields.io/badge/SUMO-76B900?style=for-the-badge&logo=eclipse-sumo&logoColor=white',
        Pandas: 'https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white',
        NumPy: 'https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white',
        PyTorch: 'https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white',
        Keras: 'https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white',
        TensorFlow: 'https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white',
        OpenCV: 'https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white',
        'Reinforcement Learning': 'https://img.shields.io/badge/Reinforcement%20Learning-FFC107?style=for-the-badge',
        'Prompt Engineering': 'https://img.shields.io/badge/Prompt%20Engineering-9C27B0?style=for-the-badge',
        'Power BI': 'https://img.shields.io/badge/PowerBI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black',
        Excel: 'https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white',
        Tableau: 'https://img.shields.io/badge/Tableau-E97627?style=for-the-badge&logo=tableau&logoColor=white',
        SharePoint: 'https://img.shields.io/badge/SharePoint-0078D4?style=for-the-badge&logo=microsoft-sharepoint&logoColor=white',
        Confluence: 'https://img.shields.io/badge/Confluence-172B4D?style=for-the-badge&logo=confluence&logoColor=white',
        Jira: 'https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white',
        GitHub: 'https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white',
    };
    const url = badgeMap[skillName];
    if (!url) return null;
    return <img src={url} alt={`${skillName} skill badge`} className="transition-transform duration-300 transform hover:scale-110" />;
};

// --- HELPERS ---
const AnimateOnScroll = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsInView(true); observer.unobserve(entry.target); }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);
    return (
        <div ref={ref} className={`transition-all duration-700 ${className} ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

const Card = ({ children, className }) => (<div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${className}`}>{children}</div>);

const Section = ({ id, title, children }) => (
    <section id={id} className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
            <AnimateOnScroll>
                <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-12 text-white relative" data-section={id}>
                    <span>{title}</span>
                </h2>
            </AnimateOnScroll>
            {children}
        </div>
    </section>
);

// --- HEADER ---
const Header = ({ activeSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navLinks = ["roadmap", "skills", "projects", "assistant", "certifications", "contact"];
    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const navLinkClasses = "relative capitalize transition-colors duration-300 py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-cyan-400 after:transition-all after:duration-300";
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-gray-900/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="#" className="text-xl sm:text-2xl font-bold text-white mr-4">{portfolioData.personalInfo.name}</a>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (<a key={link} href={`#${link}`} className={`${navLinkClasses} ${activeSection === link ? "text-cyan-400 after:w-full" : "text-gray-300 hover:text-cyan-400 after:w-0"}`}>{link}</a>))}
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                </button>
            </nav>
            <div className={`md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg transition-transform duration-300 ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full pointer-events-none'}`}>
                <div className="flex flex-col items-center space-y-4 py-8">
                    {navLinks.map(link => (<a key={link} href={`#${link}`} onClick={() => setIsMenuOpen(false)} className={`text-lg capitalize transition-colors duration-300 ${activeSection === link ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}>{link}</a>))}
                </div>
            </div>
        </header>
    );
};

// --- HERO ---
const Hero = () => (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-16">
        <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimateOnScroll className="flex justify-center">
                    <img src="/Profile pic.jpg" alt="Ashwin" className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-cyan-500/50 shadow-2xl" />
                </AnimateOnScroll>
                <div className="text-center md:text-left">
                    <AnimateOnScroll delay={150}>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Ashwin</span></h1>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={300}>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">{portfolioData.personalInfo.title}</p>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={450}>
                        <p className="text-gray-400 max-w-xl mx-auto md:mx-0 mb-8">{portfolioData.personalInfo.bio}</p>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={600}>
                        <a href={portfolioData.personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                            <DownloadIcon className="w-5 h-5 mr-2" /> Download Resume
                        </a>
                    </AnimateOnScroll>
                </div>
            </div>
        </div>
    </section>
);

// --- ROADMAP ---
const CareerRoadmapSection = () => (
    <Section id="roadmap" title="Career Roadmap">
        <div className="relative border-l-2 border-gray-700 pl-8 space-y-12">
            {portfolioData.careerRoadmap.map((item, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                    <div className="relative">
                        <div className="absolute -left-10 w-5 h-5 bg-cyan-500 rounded-full border-4 border-gray-900 flex items-center justify-center text-gray-900">
                            {item.type === 'work' ? <BriefcaseIcon className="w-3 h-3" /> : <GraduationCapIcon className="w-3 h-3" />}
                        </div>
                        <p className="text-sm font-semibold text-cyan-400">{item.period}</p>
                        <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                        <p className="text-md text-gray-400">{item.institution}</p>
                        <p className="text-gray-400 mt-2 whitespace-pre-line">{item.details}</p>
                        {item.paperUrl && (
                            <a href={item.paperUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cyan-300 bg-cyan-900/50 hover:bg-cyan-800/50">
                                <DownloadIcon className="w-4 h-4 mr-2" /> Download Paper
                            </a>
                        )}
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- SKILLS ---
const SkillsSection = () => (
    <Section id="skills" title="Skills">
        <div className="space-y-12">
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
                <AnimateOnScroll key={category} delay={index * 150} className="skill-card-animator">
                    <Card className="!p-6">
                        <h3 className="skill-category-title text-xl font-bold text-white mb-6 text-center relative"><span>{category}</span></h3>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {skills.map((skill, si) => (
                                <div key={skill} className="skill-badge-wrapper" style={{ transitionDelay: `${300 + si * 80}ms` }}>
                                    <SkillBadge skillName={skill} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- PROJECTS ---
const ProjectsSection = () => (
    <Section id="projects" title="Projects">
        <div className="grid md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                    <Card className="flex flex-col h-full">
                        {project.visualComponent === 'LidarFusion' && <LidarFusionVisual />}
                        {project.visualComponent === 'GenerativeAI' && <GenerativeAIVisual />}
                        {project.visualComponent === 'ReinforcementLearning' && <RLVisual />}
                        {project.visualComponent === 'Roundabout' && <RoundaboutVisual />}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-gray-400 mb-4 flex-grow whitespace-pre-line">{project.description}</p>
                            <div className="mb-4 mt-auto">
                                <p className="text-sm font-semibold text-gray-300 mb-2">Technologies:</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded">{tech}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end items-center pt-4 border-t border-gray-700">
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><GitHubIcon className="w-6 h-6" /></a>
                            </div>
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- AI ASSISTANT ---
const AIAssistantSection = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!jobDesc.trim()) { setError('Please paste a job description first.'); return; }
        setIsGenerating(true);
        setError('');
        setGeneratedText('');

        // ENFORCED THIRD-PERSON SYSTEM PROMPT
        const systemPrompt = `You are a professional AI Match Analysis tool. 
        Your task is to analyze Ashwin Muniappan's portfolio and determine how well he fits a specific job role.
        STRICT RULES:
        1. NEVER use "I," "me," or "my." 
        2. ALWAYS speak about the candidate in the third person using "Ashwin" or "the candidate."
        3. Write exactly 3-4 professional sentences.
        4. Focus on matching specific skills (Reinforcement Learning, Sensor Fusion, Python) to the job requirements.
        5. Tone: Objective, professional, and analytical.`;
        
        const userQuery = `Candidate Portfolio: ${JSON.stringify(portfolioData)}\n\nJob for Analysis: ${jobDesc}`;

        try {
            const result = await callGeminiAPI(userQuery, systemPrompt);
            setGeneratedText(result);
        } catch (err) {
            console.error("AI Assistant Error:", err);
            setError(err.message || 'The AI service is currently busy. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Section id="assistant" title="AI Recruiter Assistant">
            <AnimateOnScroll>
                <Card className="max-w-3xl mx-auto !p-0">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-xl font-bold text-white flex items-center"><BotIcon className="w-6 h-6 mr-2 text-cyan-500" /> Technical Match Analysis</h3>
                             <span className="text-[10px] bg-cyan-900/30 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded uppercase tracking-widest font-bold">AI Powered</span>
                        </div>
                        <AIAssistantVisual isGenerating={isGenerating} />
                        <p className="text-gray-400 mt-4 mb-4 text-sm italic">Paste a job description below to see an objective AI-generated analysis of Ashwin's technical fit.</p>
                        <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste job description here..." className="w-full h-40 p-3 rounded-md bg-gray-900/50 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-500 transition text-sm" disabled={isGenerating} />
                        <button onClick={handleGenerate} disabled={isGenerating} className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transform hover:scale-[1.02] transition shadow-lg">
                            <SparklesIcon className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Analyzing Match...' : 'Generate Fit Report'}
                        </button>
                        {error && <p className="text-red-500 text-xs mt-4 text-center px-4">{error}</p>}
                    </div>
                    {generatedText && (
                        <div className="border-t border-gray-700 p-6 bg-gray-900/90">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Candidate Fit Report</h4>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{generatedText}</p>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 italic">This report is an automated technical evaluation based on the candidate's verified portfolio data.</p>
                        </div>
                    )}
                </Card>
            </AnimateOnScroll>
        </Section>
    );
};

// --- CERTIFICATIONS ---
const CertificationsSection = () => (
    <Section id="certifications" title="Certifications">
        <div className="grid sm:grid-cols-2 gap-8">
            {portfolioData.certifications.map((cert, index) => (
                <AnimateOnScroll key={index} delay={index * 150}>
                    <Card className="h-full">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                            <p className="text-gray-400 mt-1">{cert.issuer}</p>
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:underline mt-4">View Credential <ExternalLinkIcon className="w-4 h-4 ml-1" /></a>
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- CONTACT ---
const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('https://formspree.io/f/mdkwevkg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) { setSubmitStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }); }
            else throw new Error('Failed');
        } catch { setSubmitStatus('error'); }
        finally { setIsSubmitting(false); setTimeout(() => setSubmitStatus(null), 6000); }
    };

    return (
        <Section id="contact" title="Get In Touch">
            <AnimateOnScroll>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><MailIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div><h3 className="text-lg font-semibold text-white">Email</h3><p className="text-gray-400">{portfolioData.personalInfo.email}</p></div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><PhoneIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div><h3 className="text-lg font-semibold text-white">Phone</h3><p className="text-gray-400">{portfolioData.personalInfo.phone}</p></div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><MapPinIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div><h3 className="text-lg font-semibold text-white">Location</h3><p className="text-gray-400">{portfolioData.personalInfo.location}</p></div>
                        </div>
                    </div>
                    <Card className="!p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2.5 rounded bg-gray-900/50 border border-gray-600 text-white" />
                            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full p-2.5 rounded bg-gray-900/50 border border-gray-600 text-white" />
                            <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="w-full p-2.5 rounded bg-gray-900/50 border border-gray-600 text-white" />
                            <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows="4" className="w-full p-2.5 rounded bg-gray-900/50 border border-gray-600 text-white"></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full p-3 rounded bg-cyan-600 text-white hover:bg-cyan-700 transition">
                                <SendIcon className={`w-4 h-4 mr-2 inline ${isSubmitting ? 'animate-spin' : ''}`} /> {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitStatus === 'success' && <p className="text-green-500 text-sm text-center">Sent!</p>}
                            {submitStatus === 'error' && <p className="text-red-500 text-sm text-center">Error occurred.</p>}
                        </form>
                    </Card>
                </div>
            </AnimateOnScroll>
        </Section>
    );
};

const Footer = () => (<footer className="bg-gray-900/50 py-12 text-center text-gray-400"><div className="flex justify-center space-x-6 mb-4"><a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer"><GitHubIcon className="w-6 h-6 hover:text-cyan-400" /></a><a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon className="w-6 h-6 hover:text-cyan-400" /></a></div><p>&copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}.</p></footer>);

// --- APP ---
export default function App() {
    const [activeSection, setActiveSection] = useState('hero');
    const sectionRefs = { hero: useRef(null), roadmap: useRef(null), skills: useRef(null), projects: useRef(null), assistant: useRef(null), certifications: useRef(null), contact: useRef(null) };
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
        }, { rootMargin: '-30% 0px -70% 0px' });
        Object.values(sectionRefs).forEach(r => r.current && observer.observe(r.current));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-white selection:bg-cyan-500/30">
            <style>{`
                .section-title span { display: inline-block; transition: all 0.7s; transform: translateY(100%); opacity: 0; }
                .opacity-100 .section-title span { transform: translateY(0); opacity: 1; }
                .section-title::after { content: ''; position: absolute; bottom: -10px; left: 50%; width: 0; height: 3px; background: #06b6d4; transition: width 0.8s 0.4s; transform: translateX(-50%); }
                .opacity-100 .section-title::after { width: 80px; }
            `}</style>
            <Header activeSection={activeSection} />
            <main>
                <div id="hero" ref={sectionRefs.hero}><Hero /></div>
                <div id="roadmap" ref={sectionRefs.roadmap}><CareerRoadmapSection /></div>
                <div id="skills" ref={sectionRefs.skills}><SkillsSection /></div>
                <div id="projects" ref={sectionRefs.projects}><ProjectsSection /></div>
                <div id="assistant" ref={sectionRefs.assistant}><AIAssistantSection /></div>
                <div id="certifications" ref={sectionRefs.certifications}><CertificationsSection /></div>
                <div id="contact" ref={sectionRefs.contact}><ContactSection /></div>
            </main>
            <Footer />
        </div>
    );
}
