import React, { useState, useEffect, useRef } from 'react';

// --- PERSONALIZED DATA from your Resume ---
const portfolioData = {
  personalInfo: {
    name: "Ashwin",
    title: "AI Engineer for Autonomous Systems",
    bio: "Aspiring AI Engineer with a background in ERP analysis and a passion for autonomous systems. Experienced in developing automation scripts, managing data, and working on cutting-edge computer vision and generative AI projects. Currently pursuing a Master's in AI Engineering.",
    email: "mashwinvignesh@gmail.com",
    phone: "+49 15560090137", // Added from resume
    location: "Ingolstadt, Germany", // Added from context
    github: "https://github.com/Ashwin-AIAS",
    linkedin: "https://linkedin.com/in/ashwin-vignesh-m-902344212",
    resumeUrl: "https://drive.google.com/file/d/19W761Zx-8MJwUifXZEgeyx-8fA_mZSgJ/view?usp=sharing" // <-- Your link has been added
  },
  careerRoadmap: [
    {
      type: 'education',
      title: "B.Tech in Mechanical Engineering",
      institution: "Reva University, Bengaluru, India",
      period: "2018 - 2022",
      details: "• Key Project: Development of an Automated Hydroponic Plant Grow System using Arduino and computer vision (OpenCV).\n• Published a paper on the project at the 4th National Conference on New Trends in Mechanical Engineering (NCNTME-2022).",
      paperUrl: "https://docs.google.com/document/d/1KvUwEla7vlWd6N0bAy_tHdxUPUw5BuPI/edit?usp=sharing&ouid=111443545880928316642&rtpof=true&sd=true"
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
      visualComponent: 'LidarFusion', // This tells the app to use our new visual
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
    {
      title: "Generative AI for Synthetic Sensor Data",
      description: "• Developed data generation pipelines using Generative Adversarial Networks (GANs).\n• Produced rare and complex visual scenarios to augment training data.\n• Improved dataset diversity and overall model robustness.",
      technologies: ["Python", "GANs", "PyTorch", "Keras"],
      visualComponent: 'GenerativeAI', // New visual for this project
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
    {
      title: "Coordination of Automated Vehicles at Roundabouts",
      description: "• Conducted competitive and scenario analysis to evaluate various mobility strategies.\n• Contributed to roadmap recommendations for advanced traffic systems.\n• Utilized SUMO and Simulink for traffic flow simulation.",
      technologies: ["SUMO", "Simulink", "Python", "Scenario Analysis"],
      visualComponent: 'Roundabout', // New visual for this project
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#"
    },
     {
      title: "Custom RL Environment: 'Road to Mr. Olympia 2024'",
      description: "• Developed AI agents using reinforcement learning (Q-Learning, PPO).\n• Simulated complex, multi-stage decision-making in a custom Python environment.\n• Focused on optimizing long-term rewards.",
      technologies: ["Python", "Reinforcement Learning", "Q-Learning", "PPO"],
      visualComponent: 'ReinforcementLearning', // New visual for this project
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


// --- SVG ICONS ---
const GitHubIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> );
const LinkedInIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> );
const ExternalLinkIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> );
const DownloadIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> );
const SparklesIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5a2.5 2.5 0 0 1 5 0m-2.5 5a2.5 2.5 0 0 1 5 0m-5 5a2.5 2.5 0 0 1 5 0m-2.5 5a2.5 2.5 0 0 1 5 0M2.5 9.5a2.5 2.5 0 0 1 0-5m5 2.5a2.5 2.5 0 0 1 0-5m5 5a2.5 2.5 0 0 1 0-5m5 2.5a2.5 2.5 0 0 1 0-5m-5 15a2.5 2.5 0 0 1 0-5m-5 2.5a2.5 2.5 0 0 1 0-5m-2.5-2.5a2.5 2.5 0 0 1 0-5"/></svg>);
const BotIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> );
const MailIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> );
const PhoneIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> );
const MapPinIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> );
const SendIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> );
const BriefcaseIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> );
const GraduationCapIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.7.7 3.2 2 4"></path><path d="M18 12v5a2.2 2.2 0 0 1-2 2.7"></path></svg> );


// --- NEW VISUAL COMPONENTS ---
const LidarFusionVisual = () => {
    return (
        <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center">
            <style>
                {`
                    @keyframes lidar-scan {
                        0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
                        100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
                    }
                    .lidar-point {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background-color: #06b6d4; /* cyan-500 */
                        border-radius: 50%;
                        animation: lidar-scan 1.5s ease-out infinite;
                    }
                `}
            </style>
            <div className="absolute top-1/2 left-4 w-0 h-0 border-t-[40px] border-t-transparent border-b-[40px] border-b-transparent border-l-[60px] border-l-cyan-500/10 -translate-y-1/2"></div>
            <svg viewBox="0 0 100 40" className="w-4/6 h-auto z-10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5">
                <path d="M 5,25 C 5,20 10,20 15,20 L 25,15 C 30,10 40,10 50,12 L 70,12 C 80,12 85,20 90,25 C 95,30 95,30 95,30 L 5,30 C 5,30 5,30 5,25 Z" />
                <circle cx="20" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
                <circle cx="80" cy="30" r="4" stroke="rgba(255,255,255,0.4)" />
            </svg>
            <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full z-20 shadow-[0_0_10px_#06b6d4]"></div>
            <div className="absolute top-1/2 left-4 w-3 h-3 bg-blue-400 rounded-full z-20 shadow-[0_0_10px_#3b82f6] -translate-y-1/2"></div>
            {[...Array(20)].map((_, i) => {
                const targets = [ { x: '15px', y: '10px' }, { x: '25px', y: '-5px' }, { x: '40px', y: '-10px' }, { x: '60px', y: '-8px' }, { x: '80px', y: '5px' }, { x: '90px', y: '15px' }, { x: '80px', y: '20px' }, { x: '20px', y: '20px' } ];
                const target = targets[i % targets.length];
                return ( <div key={i} className="lidar-point" style={{ top: '16px', left: '16px', '--tx': target.x, '--ty': target.y, animationDelay: `${i * 0.08}s` }} ></div> );
            })}
        </div>
    );
};

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
            <style>
                {` @keyframes radar-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .radar-sweep::after { content: ''; position: absolute; left: 50%; top: 0; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(96, 165, 250, 0.2)); } @keyframes dot-fade-in { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } } .synthetic-dot { animation: dot-fade-in 0.5s ease-out; } `}
            </style>
            <div className="absolute w-[200%] h-[200%] rounded-full radar-sweep" style={{ animation: 'radar-sweep 4s linear infinite' }}></div>
            {dots.map((dot, i) => (
                <div key={i} className="absolute w-2 h-2 bg-blue-400 rounded-full synthetic-dot shadow-[0_0_8px_#60a5fa]" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}></div>
            ))}
             <div className="absolute w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
    );
};

const RLVisual = () => {
    return (
        <div className="w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center p-4">
             <style>
                {` @keyframes agent-move { 0%, 20% { top: 12.5%; left: 12.5%; } 35% { top: 12.5%; left: 37.5%; } 50% { top: 37.5%; left: 37.5%; } 65% { top: 37.5%; left: 62.5%; } 80%, 100% { top: 62.5%; left: 62.5%; } } .rl-agent { animation: agent-move 5s ease-in-out infinite; } `}
            </style>
            <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full max-w-[152px] max-h-[152px]">
                {[...Array(16)].map((_, i) => ( <div key={i} className="w-full h-full bg-gray-700/50 rounded-sm"></div> ))}
            </div>
            <div className="absolute w-[12.5%] h-[12.5%] top-[62.5%] left-[62.5%] flex items-center justify-center text-2xl">🏆</div>
            <div className="absolute w-[12.5%] h-[12.5%] bg-amber-400 rounded-full rl-agent shadow-[0_0_10px_#f59e0b]"></div>
        </div>
    );
};

const RoundaboutVisual = () => {
    return (
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
                {/* Roads */}
                <div className="absolute w-full h-6 bg-gray-600 top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-full w-6 bg-gray-600 left-1/2 -translate-x-1/2"></div>
                {/* Roundabout circle */}
                <div className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full border-4 border-gray-600"></div>
                {/* Cars */}
                <div className="absolute w-full h-full top-0 left-0">
                    <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-red-500 rounded-sm car car-1"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-blue-500 rounded-sm car car-2"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-yellow-500 rounded-sm car car-3"><div className="w-full h-full rounded-sm wifi-pulse"></div></div>
                </div>
            </div>
        </div>
    );
};

const AIAssistantVisual = ({ isGenerating }) => {
    return (
        <div className="w-full h-24 bg-gray-900/50 rounded-t-lg p-4 relative overflow-hidden">
             <style>
                {` @keyframes scan-glow { 0% { box-shadow: 0 0 5px 2px rgba(6, 182, 212, 0.5); } 50% { box-shadow: 0 0 15px 5px rgba(6, 182, 212, 0.8); } 100% { box-shadow: 0 0 5px 2px rgba(6, 182, 212, 0.5); } } @keyframes scanner-move { 0% { top: -10px; } 100% { top: 100%; } } `}
            </style>
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
};

// --- SKILL BADGE COMPONENT ---
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
        'Reinforcement Learning': 'https://img.shields.io/badge/Reinforcement%20Learning-FFC107?style=for-the-badge&logoColor=black',
        'Prompt Engineering': 'https://img.shields.io/badge/Prompt%20Engineering-9C27B0?style=for-the-badge&logoColor=white',
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


// --- ANIMATION WRAPPER COMPONENT ---
const AnimateOnScroll = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className} ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};


// --- GEMINI API CALLER ---
const callGeminiAPI = async (prompt) => {
    const apiKey = ""; // Canvas will provide the key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
          throw new Error("No text found in API response.");
        }
        return text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};


// --- REUSABLE COMPONENTS ---
const Card = ({ children, className }) => ( <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${className}`}>{children}</div> );
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

// --- HEADER & NAVIGATION ---
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
  const activeLinkClasses = "text-cyan-400 after:w-full";
  const inactiveLinkClasses = "text-gray-300 hover:text-cyan-400 after:w-0";


  return ( <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-gray-900/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}><nav className="container mx-auto px-4 py-4 flex justify-between items-center"><a href="#" className="text-xl sm:text-2xl font-bold text-white mr-4">{portfolioData.personalInfo.name}</a><div className="hidden md:flex items-center space-x-8">{navLinks.map(link => ( <a key={link} href={`#${link}`} className={`${navLinkClasses} ${activeSection === link ? activeLinkClasses : inactiveLinkClasses}`}>{link}</a> ))}</div><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 flex-shrink-0"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg></button></nav><div className={`md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full pointer-events-none'}`}><div className="flex flex-col items-center space-y-4 py-8">{navLinks.map(link => ( <a key={link} href={`#${link}`} onClick={() => setIsMenuOpen(false)} className={`text-lg capitalize transition-colors duration-300 ${activeSection === link ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}>{link}</a> ))}</div></div></header> );
};

// --- HERO SECTION (with Profile Picture) ---
const Hero = () => {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-16">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <AnimateOnScroll className="flex justify-center">
                        <img 
                            src="/Profile pic.jpg" // This path works because the image is in the 'public' folder
                            alt="Ashwin" 
                            className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-cyan-500/50 shadow-2xl"
                        />
                    </AnimateOnScroll>

                    {/* Text Column */}
                    <div className="text-center md:text-left">
                        <AnimateOnScroll delay={150}>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Ashwin</span>
                            </h1>
                        </AnimateOnScroll>
                        <AnimateOnScroll delay={300}>
                            <p className="text-xl md:text-2xl text-gray-300 mb-8">{portfolioData.personalInfo.title}</p>
                        </AnimateOnScroll>
                        <AnimateOnScroll delay={450}>
                            <div className="relative max-w-xl mx-auto md:mx-0 mb-8">
                                <p className="text-gray-400">
                                    {portfolioData.personalInfo.bio}
                                </p>
                            </div>
                        </AnimateOnScroll>
                        <AnimateOnScroll delay={600}>
                            <div className="flex justify-center md:justify-start items-center gap-4">
                                 <a href={portfolioData.personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download Resume
                                </a>
                            </div>
                        </AnimateOnScroll>
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- CAREER ROADMAP SECTION (formerly Education) ---
const CareerRoadmapSection = () => (
    <Section id="roadmap" title="Career Roadmap">
        <div className="relative border-l-2 border-gray-700 pl-8 space-y-12">
            {portfolioData.careerRoadmap.map((item, index) => (
                 <AnimateOnScroll key={index} delay={index * 150}>
                    <div className="relative">
                        <div className="absolute -left-10 w-5 h-5 bg-cyan-500 rounded-full border-4 border-gray-900 flex items-center justify-center text-gray-900">
                            {item.type === 'work' ? <BriefcaseIcon className="w-3 h-3"/> : <GraduationCapIcon className="w-3 h-3"/>}
                        </div>
                        <p className="text-sm font-semibold text-cyan-400">{item.period}</p>
                        <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                        <p className="text-md text-gray-400">{item.institution}</p>
                        <p className="text-gray-400 mt-2 whitespace-pre-line">{item.details}</p>
                        {item.paperUrl && (
                            <a href={item.paperUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cyan-300 bg-cyan-900/50 hover:bg-cyan-800/50 transition-colors">
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Download Paper
                            </a>
                        )}
                    </div>
                 </AnimateOnScroll>
            ))}
        </div>
    </Section>
);


// --- SKILLS SECTION (BADGE STYLE WITH ANIMATION) ---
const SkillsSection = () => (
    <Section id="skills" title="Skills">
        <div className="space-y-12">
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
                <AnimateOnScroll key={category} delay={index * 150} className="skill-card-animator">
                    <Card className="!p-6">
                        <h3 className="skill-category-title text-xl font-bold text-white mb-6 text-center relative">
                           <span>{category}</span>
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {skills.map((skill, skillIndex) => (
                                <div
                                    key={skill}
                                    className="skill-badge-wrapper"
                                    style={{ transitionDelay: `${300 + skillIndex * 80}ms` }}
                                >
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

// --- PROJECTS SECTION ---
const ProjectsSection = () => {
    return (
        <Section id="projects" title="Projects">
             <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project, index) => (
                    <AnimateOnScroll key={index} delay={index * 150}>
                        <Card className="flex flex-col h-full">
                            {project.visualComponent === 'LidarFusion' && <LidarFusionVisual />}
                            {project.visualComponent === 'GenerativeAI' && <GenerativeAIVisual />}
                            {project.visualComponent === 'ReinforcementLearning' && <RLVisual />}
                            {project.visualComponent === 'Roundabout' && <RoundaboutVisual />}
                            {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />}

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-400 mb-4 flex-grow whitespace-pre-line">{project.description}</p>
                                
                                <div className="mb-4 mt-auto">
                                    <p className="text-sm font-semibold text-gray-300 mb-2">Technologies:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map(tech => (
                                            <span key={tech} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded">
                                                {tech}
                                            </span>
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
}

// --- AI ASSISTANT SECTION ---
const AIAssistantSection = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!jobDesc.trim()) {
            setError('Please paste a job description first.');
            return;
        }
        setIsGenerating(true);
        setError('');
        setGeneratedText('');

        const fullPortfolioContext = `
            My name is ${portfolioData.personalInfo.name}. 
            My professional title is ${portfolioData.personalInfo.title}.
            My bio is: "${portfolioData.personalInfo.bio}".
            My skills are: ${JSON.stringify(portfolioData.skills)}.
            My projects are: ${portfolioData.projects.map(p => `${p.title}: ${p.description}`).join('; ')}.
            My career roadmap is: ${portfolioData.careerRoadmap.map(e => `${e.title} at ${e.institution}`).join('; ')}.
        `;

        const prompt = `You are a helpful AI career assistant. Based on my portfolio details provided below, please write a concise, professional paragraph (3-4 sentences) explaining why I am a strong candidate for the following job description. Focus on connecting my most relevant skills and projects to the job's key requirements.

        My Portfolio Details:
        ${fullPortfolioContext}

        Job Description to Analyze:
        "${jobDesc}"
        `;

        try {
            const result = await callGeminiAPI(prompt);
            setGeneratedText(result);
        } catch (err) {
            setError('Sorry, something went wrong. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Section id="assistant" title="AI Recruiter Assistant">
            <AnimateOnScroll>
                <Card className="max-w-3xl mx-auto !p-0">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white flex items-center mb-4"><BotIcon className="w-6 h-6 mr-2 text-cyan-500"/> For Recruiters</h3>
                        <AIAssistantVisual isGenerating={isGenerating} />
                        <p className="text-gray-400 mt-4 mb-4">Paste a job description below and let my AI assistant highlight how my skills align with your needs.</p>
                        <textarea
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            placeholder="Paste job description here..."
                            className="w-full h-40 p-3 rounded-md bg-gray-900/50 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                            disabled={isGenerating}
                        />
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating}
                            className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-transform duration-200 hover:scale-105"
                        >
                            <SparklesIcon className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`}/>
                            {isGenerating ? 'Analyzing...' : 'Generate Analysis'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                    
                    {generatedText && (
                        <div className="border-t border-gray-700">
                            <div className="p-6 bg-gray-900/50">
                                <h4 className="font-semibold text-gray-200 mb-2">AI-Generated Summary:</h4>
                                <p className="text-gray-400 whitespace-pre-wrap">{generatedText}</p>
                            </div>
                        </div>
                    )}
                </Card>
            </AnimateOnScroll>
        </Section>
    );
};


// --- CERTIFICATIONS SECTION ---
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

// --- CONTACT SECTION ---
const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        const serviceID = 'service_qo3daqa';
        const templateID = 'template_oydachb';

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
        };

        if (window.emailjs) {
            window.emailjs.send(serviceID, templateID, templateParams)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    setSubmitStatus('success');
                    setFormData({ name: '', email: '', subject: '', message: '' });
                }, (err) => {
                    console.error('FAILED...', err);
                    setSubmitStatus('error');
                })
                .finally(() => {
                    setIsSubmitting(false);
                    setTimeout(() => setSubmitStatus(null), 6000);
                });
        } else {
            console.error("EmailJS script not loaded");
            setSubmitStatus('error');
            setIsSubmitting(false);
        }
    };

    return (
        <Section id="contact" title="Get In Touch">
            <AnimateOnScroll>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><MailIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Email</h3>
                                <p className="text-gray-400">{portfolioData.personalInfo.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><PhoneIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Phone</h3>
                                <p className="text-gray-400">{portfolioData.personalInfo.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-cyan-900/50 p-3 rounded-full"><MapPinIcon className="w-6 h-6 text-cyan-400" /></div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Location</h3>
                                <p className="text-gray-400">{portfolioData.personalInfo.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="!p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2.5 rounded-md bg-gray-900/50 border border-gray-600 focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-2.5 rounded-md bg-gray-900/50 border border-gray-600 focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full p-2.5 rounded-md bg-gray-900/50 border border-gray-600 focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                            <div className="mb-6">
                                 <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows="4" className="w-full p-2.5 rounded-md bg-gray-900/50 border border-gray-600 focus:ring-2 focus:ring-cyan-500"></textarea>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition">
                                <SendIcon className={`w-5 h-5 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitStatus === 'success' && <p className="text-green-500 text-sm mt-4 text-center">Message sent successfully! Thank you.</p>}
                            {submitStatus === 'error' && <p className="text-red-500 text-sm mt-4 text-center">Something went wrong. Please try again.</p>}
                        </form>
                    </Card>
                </div>
            </AnimateOnScroll>
        </Section>
    )
};


// --- FOOTER ---
const Footer = () => ( <footer className="bg-gray-900/50 py-12 px-4"><div className="container mx-auto text-center text-gray-400"><div className="flex justify-center space-x-6 mb-4"><a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors"><GitHubIcon className="w-6 h-6" /></a><a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors"><LinkedInIcon className="w-6 h-6" /></a></div><p>&copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}. All Rights Reserved.</p></div></footer> );

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRefs = { hero: useRef(null), roadmap: useRef(null), skills: useRef(null), projects: useRef(null), assistant: useRef(null), certifications: useRef(null), contact: useRef(null) };

  useEffect(() => {
    // --- Add and Initialize EmailJS Script ---
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    script.onload = () => {
        // Initialize EmailJS after the script has loaded, using your Public Key
        window.emailjs.init({ publicKey: 'CyDvjHP-WO-FjElza' });
    };
    document.body.appendChild(script);

    document.title = `${portfolioData.personalInfo.name} | ${portfolioData.personalInfo.title}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) { metaDescription.setAttribute('content', portfolioData.personalInfo.bio); } 
    else { const newMeta = document.createElement('meta'); newMeta.name = 'description'; newMeta.content = portfolioData.personalInfo.bio; document.head.appendChild(newMeta); }

    // This is the corrected smooth scrolling logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if the href is more than just a '#'
            if (href && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (href === '#') {
                // Handle links that are just '#'
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    const observer = new IntersectionObserver( (entries) => { entries.forEach(entry => { if (entry.isIntersecting) { setActiveSection(entry.target.id); } }); }, { rootMargin: '-30% 0px -70% 0px' } );
    Object.values(sectionRefs).forEach(ref => { if (ref.current) { observer.observe(ref.current); } });
    return () => { Object.values(sectionRefs).forEach(ref => { if (ref.current) { observer.unobserve(ref.current); } }); };
  }, []);

  return (
    <div className="bg-gray-900 font-sans leading-normal tracking-tight antialiased">
      <style>{`
        /* --- Section Title Animations --- */
        .section-title {
            display: inline-block;
        }
        .section-title span {
            display: inline-block;
            transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1) 0.1s, opacity 0.5s ease 0.1s;
            transform: translateY(100%);
            opacity: 0;
        }
        .opacity-100 .section-title span {
            transform: translateY(0);
            opacity: 1;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px; /* Positioned below the text */
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background: linear-gradient(to right, #06b6d4, #3b82f6);
            border-radius: 2px;
            transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.4s;
        }
        .opacity-100 .section-title::after {
            width: 80px;
        }

        .section-title::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -45px; /* Give it some space */
            transform: translateY(-50%) scale(0) rotate(-45deg);
            opacity: 0;
            width: 32px; /* A bit bigger */
            height: 32px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.6s, opacity 0.4s ease 0.6s;
        }
        .opacity-100 .section-title::before {
            transform: translateY(-50%) scale(1) rotate(0deg);
            opacity: 1;
        }
        
        /* Using URL-encoded SVGs for before elements */
        [data-section="roadmap"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c0 1.7.7 3.2 2 4'/%3E%3Cpath d='M18 12v5a2.2 2.2 0 0 1-2 2.7'/%3E%3C/svg%3E"); }
        [data-section="skills"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m12 14 4-4'/%3E%3Cpath d='M12 14 8 10'/%3E%3Cpath d='M12 6v8'/%3E%3Cpath d='M12 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'/%3E%3Cpath d='M12 2v2'/%3E%3C/svg%3E"); }
        [data-section="projects"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 11 2-2-2-2'/%3E%3Cpath d='M11 13h4'/%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3C/svg%3E"); }
        [data-section="assistant"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"); }
        [data-section="certifications"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m15.232 5.232 3.536 3.536'/%3E%3Cpath d='M2 18h.01'/%3E%3Cpath d='M21 12a9 9 0 1 1-9-9c2.512 0 4.888.972 6.666 2.664L12 13'/%3E%3Cpath d='M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'/%3E%3Cpath d='m4.243 19.757 2.121-2.121'/%3E%3C/svg%3E"); }
        [data-section="contact"]::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m22 2-7 20-4-9-9-4Z'/%3E%3Cpath d='M22 2 11 13'/%3E%3C/svg%3E"); }

        /* --- Skill Category Title Animations --- */
        .skill-category-title {
            padding-bottom: 12px;
        }
        .skill-category-title span {
            display: inline-block;
            transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1) 0.2s, opacity 0.5s ease-out 0.2s;
            transform: translateY(20px);
            opacity: 0;
        }
        .opacity-100 .skill-category-title span {
            transform: translateY(0);
            opacity: 1;
        }
        .skill-category-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: #06b6d4;
            border-radius: 1px;
            transition: width 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.4s;
        }
        .opacity-100 .skill-category-title::after {
            width: 50px;
        }

        /* --- Skill Badge Stagger Animation --- */
        .skill-badge-wrapper {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        .skill-card-animator.opacity-100 .skill-badge-wrapper {
            opacity: 1;
            transform: translateY(0);
        }
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

