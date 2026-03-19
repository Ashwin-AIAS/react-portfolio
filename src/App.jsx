import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { embedJobDescription, embedMultimodal, cosineSimilarity, generateFitReport } from './geminiEmbed';
import avatarEmoji from '/avatar-emoji.png';

// --- THEME CONTEXT ---
const ThemeContext = createContext({ isDark: true, setIsDark: () => {} });

// --- PERSONALIZED DATA ---       
const portfolioData = {
  personalInfo: {
    name: "Ashwin",
    title: "AI Engineer for Autonomous Systems",
    bio: "Master's student in AI Engineering at THI Germany, with production experience building computer vision pipelines, full-stack RAG systems, and LLM-powered tools. Former ERP Analyst at DXC Technology. Focused on bridging AI research and real-world deployment in autonomous systems.",
    email: "mashwinvignesh@gmail.com",
    phone: "+49 15560090137",
    location: "Ingolstadt, Germany",
    github: "https://github.com/Ashwin-AIAS",
    linkedin: "https://linkedin.com/in/ashwin-vignesh-m-902344212",
    resumeUrl: "https://drive.google.com/file/d/1us-aWBOkPxuXZE7wg90DN1T5JsOPpD-g/view?usp=sharing"
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
    "Programming & Tools": ["Python", "C/C++", "SQL", "FastAPI", "Docker", "CMake", "Power Automate", "Simulink", "SUMO", "Pandas", "NumPy"],
    "AI/ML": ["PyTorch", "Keras", "TensorFlow", "OpenCV", "YOLOv8", "MediaPipe", "GANs", "LangChain", "Gemini API", "Reinforcement Learning", "Prompt Engineering"],
    "Web & Backend": ["React", "PostgreSQL", "pgvector", "Streamlit"],
    "Data Analysis & Visualization": ["Power BI", "Excel", "Tableau"],
    "Collaboration": ["SharePoint", "Confluence", "Jira", "GitHub", "N8N"],
  },
  projects: [
    {
      title: "RAG System — Full-Stack Retrieval-Augmented Generation",
      description: "• Built a full-stack RAG system with document ingestion, semantic & hybrid retrieval, and grounded generation.\n• Implemented cross-encoder reranking and optional Graph RAG via Neo4j.\n• Features conversation history, feedback system, and admin analytics dashboard.",
      technologies: ["FastAPI", "React", "PostgreSQL", "pgvector", "Docker", "Gemini API", "LangChain"],
      visualComponent: 'RAGSystem',
      githubUrl: "https://github.com/Ashwin-AIAS/rag-foundation-pgvector",
      liveUrl: "#",
      category: "NLP/RAG"
    },
    {
      title: "Mini-CNN Framework",
      description: "• Implemented a custom LeNet-5 inference engine from scratch in C/C++.\n• Optimized with HPC techniques including Im2Col for cache locality.\n• Simulated Int8 quantization and integer arithmetic for edge hardware deployment.",
      technologies: ["C/C++", "CMake", "LeNet-5", "Int8 Quantization", "HPC"],
      visualComponent: 'MiniCNN',
      githubUrl: "https://github.com/Ashwin-AIAS/Mini-CNN-Framework",
      liveUrl: "#",
      category: "Computer Vision"
    },
    {
      title: "YOLO Bat Swing Analysis",
      description: "• Built a sports analytics tool using YOLOv8 for player & bat detection and MediaPipe for pose estimation.\n• Computes swing metrics: peak speed, angular velocity, duration, angle, and smoothness score.\n• Includes Streamlit demo, CLI interface, and unit tests.",
      technologies: ["Python", "YOLOv8", "MediaPipe", "OpenCV", "Streamlit"],
      visualComponent: 'BatSwing',
      githubUrl: "https://github.com/Ashwin-AIAS/Yolo-Bat-swing-analysis-",
      liveUrl: "#",
      category: "Computer Vision"
    },
    {
      title: "Radar-AI: Object Detection with Synthetic Data",
      description: "• Explored AI-enhanced RADAR perception for autonomous systems using GAN-generated synthetic data.\n• Built CNN-based classification models trained on combined real and synthetic RADAR data.\n• Developed an AI agent for real-time object detection and classification.",
      technologies: ["Python", "GANs", "CNNs", "PyTorch", "RADAR Signal Processing"],
      visualComponent: 'RadarAI',
      githubUrl: "https://github.com/Ashwin-AIAS/Radar-AI-Enhancing-Object-Detection-with-Synthetic-Data-and-AI-driven-Classification",
      liveUrl: "#",
      category: "Autonomous Systems"
    },
    {
      title: "Face Detection & 3D Reconstruction",
      description: "• Implemented face detection pipeline using deep learning and OpenCV.\n• Performed 3D face reconstruction from 2D images.\n• Combined computer vision techniques for accurate facial feature mapping.",
      technologies: ["Python", "OpenCV", "Deep Learning", "3D Reconstruction"],
      visualComponent: 'FaceRecon',
      githubUrl: "https://github.com/Ashwin-AIAS/Face-Detection-and-3D-Reconstruction",
      liveUrl: "#",
      category: "Computer Vision"
    },
    {
      title: "Foundation Models for Computer Vision",
      description: "• Advanced camera-LiDAR fusion models.\n• Led the setup of a development environment on Jetson Nano.\n• Performed data preprocessing for large-scale Kitty and Waymo datasets.\n• Utilized Git and Jira for collaborative project management.",
      technologies: ["Python", "PyTorch", "Keras", "OpenCV", "Jetson Nano", "Git", "Jira"],
      visualComponent: 'LidarFusion',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#",
      category: "Autonomous Systems"
    },
    {
      title: "Coordination of Automated Vehicles at Roundabouts",
      description: "• Conducted competitive and scenario analysis to evaluate various mobility strategies.\n• Contributed to roadmap recommendations for advanced traffic systems.\n• Utilized SUMO and Simulink for traffic flow simulation.",
      technologies: ["SUMO", "Simulink", "Python", "Scenario Analysis"],
      visualComponent: 'Roundabout',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#",
      category: "Autonomous Systems"
    },
    {
      title: "Custom RL Environment: 'Road to Mr. Olympia 2024'",
      description: "• Developed AI agents using reinforcement learning (Q-Learning, PPO).\n• Simulated complex, multi-stage decision-making in a custom Python environment.\n• Focused on optimizing long-term rewards.",
      technologies: ["Python", "Reinforcement Learning", "Q-Learning", "PPO"],
      visualComponent: 'ReinforcementLearning',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#",
      category: "Tools"
    },
    {
      title: "N8N Webhook Forwarder",
      description: "• Built a webhook forwarding system using N8N workflow automation.\n• Configured automated data pipelines triggered by external webhook events.\n• Streamlined integration between services with event-driven architecture.",
      technologies: ["N8N", "Webhooks", "Automation", "API Integration"],
      visualComponent: 'Webhook',
      githubUrl: "https://github.com/Ashwin-AIAS/N8N",
      liveUrl: "#",
      category: "Tools"
    },
    {
      title: "Interactive Portfolio with AI Assistant",
      description: "• Built a React-based interactive portfolio utilizing Framer Motion for advanced animations.\n• Upgraded AI recruiter assistant with Gemini Embedding 2 multimodal embeddings for semantic cross-modal match scoring.\n• Implemented an animated avatar tour guide and scroll-based interactions.",
      technologies: ["React", "Framer Motion", "Gemini API", "Tailwind CSS"],
      visualComponent: 'PortfolioAI',
      githubUrl: "https://github.com/Ashwin-AIAS/portfolio",
      liveUrl: "#",
      category: "Web & Backend"
    }
  ],
  certifications: [
    {
      name: "Claude Code in Action",
      issuer: "Anthropic",
      credentialUrl: "http://verify.skilljar.com/c/633xi2hd6rm6"
    },
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
  ],
  blogPosts: [
    {
      title: "Building a RAG System from Scratch",
      summary: "Lessons learned from chunking strategies, cross-encoder reranking, and pgvector — from zero to a full-stack retrieval-augmented generation system.",
      tags: ["RAG", "LangChain", "pgvector"],
      date: "Feb 2026",
      readTime: "8 min read",
      url: "https://github.com/Ashwin-AIAS/rag-foundation-pgvector"
    },
    {
      title: "CNN from C++ — What I Learned",
      summary: "Implementing LeNet-5 without frameworks forced me to understand every matrix operation. Int8 quantization taught me how edge deployment really works.",
      tags: ["C++", "LeNet-5", "Quantization"],
      date: "Jan 2026",
      readTime: "6 min read",
      url: "https://github.com/Ashwin-AIAS/Mini-CNN-Framework"
    },
    {
      title: "Why Synthetic Data Works for RADAR",
      summary: "GAN-generated synthetic RADAR signals can dramatically improve classifier performance when real-world data is scarce. Here's what our Radar-AI project revealed.",
      tags: ["GANs", "RADAR", "Synthetic Data"],
      date: "Dec 2025",
      readTime: "7 min read",
      url: "https://github.com/Ashwin-AIAS/Radar-AI-Enhancing-Object-Detection-with-Synthetic-Data-and-AI-driven-Classification"
    }
  ]
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
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
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
        <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
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
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center p-4">
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
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
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

// --- NEW VISUAL COMPONENTS ---
const RAGSystemVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes rag-doc-flow { 0% { transform: translateX(-40px); opacity: 0; } 30% { transform: translateX(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: translateX(40px); opacity: 0; } }
            @keyframes rag-pulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
            .rag-doc { animation: rag-doc-flow 3s ease-in-out infinite; }
            .rag-node { animation: rag-pulse 2s ease-in-out infinite; }
        `}</style>
        <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="rag-doc w-10 h-8 bg-cyan-900/60 border border-cyan-500/30 rounded flex items-center justify-center" style={{ animationDelay: `${i * 0.4}s` }}>
                        <div className="space-y-1"><div className="w-5 h-0.5 bg-cyan-400/60 rounded"></div><div className="w-3 h-0.5 bg-cyan-400/40 rounded"></div></div>
                    </div>
                ))}
            </div>
            <svg width="30" height="40" className="text-cyan-500/50"><path d="M5 20 L25 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></path><polygon points="22,15 28,20 22,25" fill="currentColor"/></svg>
            <div className="relative w-16 h-16">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="absolute w-2.5 h-2.5 bg-blue-400 rounded-full rag-node shadow-[0_0_6px_#60a5fa]" style={{ top: `${50 + 28 * Math.sin(i * Math.PI / 3) - 5}%`, left: `${50 + 28 * Math.cos(i * Math.PI / 3) - 5}%`, animationDelay: `${i * 0.3}s` }}></div>
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_12px_#06b6d4]"></div>
            </div>
            <svg width="30" height="40" className="text-cyan-500/50"><path d="M5 20 L25 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></path><polygon points="22,15 28,20 22,25" fill="currentColor"/></svg>
            <div className="w-14 h-10 bg-green-900/50 border border-green-500/30 rounded-lg flex items-center justify-center">
                <div className="space-y-1"><div className="w-7 h-0.5 bg-green-400/80 rounded"></div><div className="w-5 h-0.5 bg-green-400/60 rounded"></div><div className="w-6 h-0.5 bg-green-400/40 rounded"></div></div>
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">DOC → VECTORS → ANSWER</div>
    </div>
);

const MiniCNNVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes cnn-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
            @keyframes cnn-data { 0% { transform: translateX(-10px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(10px); opacity: 0; } }
            .cnn-node { animation: cnn-pulse 2s ease-in-out infinite; }
            .cnn-data { animation: cnn-data 1.5s ease-in-out infinite; }
        `}</style>
        <div className="flex items-center gap-3">
            {[{w: 'w-8', h: 'h-24', c: 'bg-purple-500/30 border-purple-500/50', n: 4, label: 'Conv'},
              {w: 'w-6', h: 'h-20', c: 'bg-blue-500/30 border-blue-500/50', n: 3, label: 'Pool'},
              {w: 'w-6', h: 'h-16', c: 'bg-cyan-500/30 border-cyan-500/50', n: 3, label: 'Conv'},
              {w: 'w-4', h: 'h-12', c: 'bg-teal-500/30 border-teal-500/50', n: 2, label: 'FC'},
              {w: 'w-3', h: 'h-8', c: 'bg-green-500/30 border-green-500/50', n: 1, label: 'Out'}].map((layer, li) => (
                <div key={li} className="flex flex-col items-center gap-1">
                    <div className={`${layer.w} ${layer.h} ${layer.c} border rounded-md relative overflow-hidden`}>
                        {[...Array(layer.n)].map((_, ni) => (
                            <div key={ni} className="cnn-data absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ top: `${((ni + 1) / (layer.n + 1)) * 100}%`, animationDelay: `${li * 0.3 + ni * 0.2}s` }}></div>
                        ))}
                    </div>
                    <span className="text-[8px] text-gray-500 font-mono">{layer.label}</span>
                </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">LeNet-5 INFERENCE</div>
    </div>
);

const BatSwingVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes bat-swing { 0% { transform: rotate(-45deg); } 50% { transform: rotate(45deg); } 100% { transform: rotate(-45deg); } }
            @keyframes swing-trail { 0% { opacity: 0; } 30% { opacity: 0.6; } 100% { opacity: 0; } }
            .bat-arm { animation: bat-swing 2s ease-in-out infinite; transform-origin: top center; }
        `}</style>
        <div className="relative w-32 h-32">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-1 h-8 bg-gray-400/60 rounded"></div>
            <div className="absolute top-[35%] left-1/2 -translate-x-[3px] bat-arm">
                <div className="w-1.5 h-14 bg-gradient-to-b from-amber-700 to-amber-500 rounded-b-full"></div>
            </div>
            {[-30, -15, 0, 15, 30].map((angle, i) => (
                <div key={i} className="absolute top-[35%] left-1/2 w-12 h-0.5 bg-cyan-400/20 rounded" style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'left center', animation: `swing-trail 2s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}></div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {['SPD', 'ANG', 'DUR'].map((m, i) => (
                    <div key={i} className="text-[8px] bg-gray-700/80 text-cyan-400 px-1.5 py-0.5 rounded font-mono">{m}</div>
                ))}
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">SWING ANALYSIS</div>
    </div>
);

const FaceReconVisual = () => {
    const [rotation, setRotation] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setRotation(r => (r + 1) % 360), 30);
        return () => clearInterval(interval);
    }, []);
    const points = Array.from({ length: 20 }, (_, i) => {
        const theta = (i / 10) * Math.PI;
        const phi = (i % 10) * Math.PI / 5;
        const x = 30 * Math.sin(theta) * Math.cos(phi + rotation * Math.PI / 180);
        const y = 40 * Math.cos(theta);
        return { x: 50 + x, y: 45 + y * 0.6, z: Math.sin(phi + rotation * Math.PI / 180) };
    });
    return (
        <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={1 + p.z * 0.5} fill={p.z > 0 ? '#06b6d4' : '#164e63'} opacity={0.5 + p.z * 0.3} />
                ))}
                {points.slice(0, -1).map((p, i) => (
                    <line key={`l${i}`} x1={p.x} y1={p.y} x2={points[i + 1].x} y2={points[i + 1].y} stroke="#06b6d4" strokeWidth="0.3" opacity={0.2 + p.z * 0.2} />
                ))}
            </svg>
            <div className="absolute top-3 right-3 flex flex-col gap-1">
                <div className="text-[8px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded font-mono">DETECTED</div>
                <div className="text-[8px] bg-cyan-900/50 text-cyan-400 px-1.5 py-0.5 rounded font-mono">3D MAP</div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">3D RECONSTRUCTION</div>
        </div>
    );
};

const RadarAIVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes radar-sweep-ai { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes radar-blip { 0%, 80% { opacity: 0; transform: scale(0); } 90% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
            .radar-line { animation: radar-sweep-ai 3s linear infinite; }
            .radar-blip { animation: radar-blip 3s ease-out infinite; }
        `}</style>
        <div className="relative w-40 h-40">
            {[1, 2, 3].map(r => (
                <div key={r} className="absolute rounded-full border border-cyan-500/20" style={{ width: `${r * 33}%`, height: `${r * 33}%`, top: `${50 - r * 16.5}%`, left: `${50 - r * 16.5}%` }}></div>
            ))}
            <div className="absolute w-full h-full radar-line" style={{ transformOrigin: '50% 50%' }}>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-cyan-500/60 to-transparent" style={{ transformOrigin: 'bottom center' }}></div>
            </div>
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#06b6d4]"></div>
            {[{x: 30, y: 25, label: 'CAR', d: 0}, {x: 65, y: 35, label: 'PED', d: 0.8}, {x: 45, y: 70, label: 'BIKE', d: 1.6}].map((obj, i) => (
                <div key={i} className="absolute" style={{ left: `${obj.x}%`, top: `${obj.y}%` }}>
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full radar-blip shadow-[0_0_6px_#ef4444]" style={{ animationDelay: `${obj.d}s` }}></div>
                    <div className="absolute -top-4 left-3 text-[7px] bg-gray-900/80 text-green-400 px-1 py-0.5 rounded font-mono whitespace-nowrap">{obj.label}</div>
                </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">RADAR + GAN CLASSIFICATION</div>
    </div>
);

const WebhookVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes webhook-flow { 0% { transform: translateX(-8px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(8px); opacity: 0; } }
            @keyframes webhook-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(234, 75, 113, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(234, 75, 113, 0); } }
            .wh-flow { animation: webhook-flow 1.5s ease-in-out infinite; }
            .wh-pulse { animation: webhook-pulse 2s ease-in-out infinite; }
        `}</style>
        <div className="flex items-center gap-3">
            {[{label: 'TRIGGER', color: 'bg-amber-900/50 border-amber-500/30 text-amber-400'},
              {label: 'N8N', color: 'bg-pink-900/50 border-pink-500/30 text-pink-400'},
              {label: 'ACTION', color: 'bg-green-900/50 border-green-500/30 text-green-400'}].map((block, i) => (
                <React.Fragment key={i}>
                    <div className={`${block.color} border rounded-lg px-3 py-2 flex flex-col items-center gap-1 ${i === 1 ? 'wh-pulse' : ''}`}>
                        <div className={`text-[9px] font-mono font-bold ${block.color.split(' ')[2]}`}>{block.label}</div>
                        <div className="flex gap-0.5">
                            {[0, 1, 2].map(j => <div key={j} className="w-1 h-1 bg-current rounded-full opacity-40"></div>)}
                        </div>
                    </div>
                    {i < 2 && (
                        <div className="flex gap-0.5">
                            {[0, 1, 2].map(j => <div key={j} className="w-1.5 h-1.5 bg-cyan-400 rounded-full wh-flow" style={{ animationDelay: `${j * 0.2}s` }}></div>)}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">WEBHOOK AUTOMATION</div>
    </div>
);

const PortfolioAIVisual = () => (
    <div className="w-full h-48 bg-black/50 relative overflow-hidden flex items-center justify-center">
        <style>{`
            @keyframes msg-appear { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
            @keyframes typing-dot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
            @keyframes score-fill { 0% { width: 0%; } 100% { width: 82%; } }
            .msg-in { animation: msg-appear 0.4s ease-out forwards; opacity: 0; }
            .typing-dot { animation: typing-dot 1.2s ease-in-out infinite; }
        `}</style>
        <div className="w-64 rounded-xl border border-white/10 bg-gray-900/80 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
                <div className="flex-1 mx-2 h-3 bg-white/5 rounded-full text-[7px] text-white/20 flex items-center px-2">ashwin.dev</div>
            </div>
            {/* Chat messages */}
            <div className="p-3 space-y-2">
                <div className="msg-in flex justify-end" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-blue-600/80 text-white text-[9px] px-2.5 py-1.5 rounded-xl rounded-tr-sm max-w-[80%]">Analyze this job description...</div>
                </div>
                <div className="msg-in flex justify-start" style={{ animationDelay: '0.8s' }}>
                    <div className="bg-white/5 border border-white/10 text-white/70 text-[9px] px-2.5 py-1.5 rounded-xl rounded-tl-sm max-w-[80%]">
                        <div className="text-green-400 font-mono font-bold mb-1">Match Score: 82%</div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full" style={{ animation: 'score-fill 1.5s ease-out 1s forwards', width: 0 }}></div>
                        </div>
                    </div>
                </div>
                <div className="msg-in flex justify-start" style={{ animationDelay: '1.4s' }}>
                    <div className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl rounded-tl-sm flex gap-1 items-center">
                        {[0, 0.15, 0.3].map((d, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-blue-400 typing-dot" style={{ animationDelay: `${d}s` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 tracking-widest font-mono">AI RECRUITER ASSISTANT</div>
    </div>
);

const AIAssistantVisual = ({ isGenerating }) => (
    <div className="w-full h-28 bg-black/30 rounded-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
            {!isGenerating ? (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full p-4 flex flex-col justify-center space-y-2.5"
                >
                    <div className="w-3/4 h-1.5 bg-white/[0.04] rounded-full"></div>
                    <div className="w-full h-1.5 bg-white/[0.04] rounded-full"></div>
                    <div className="w-1/2 h-1.5 bg-white/[0.04] rounded-full"></div>
                </motion.div>
            ) : (
                <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-2 relative"
                >
                    {/* Outer glow pulse */}
                    <motion.div
                        className="absolute inset-0 bg-cyan-500/5 rounded-xl"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Robot head container */}
                    <div className="relative">
                        {/* Antenna */}
                        <motion.div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-cyan-400 rounded-full"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Robot head outline */}
                        <div
                            className="relative w-14 h-10 border-2 border-cyan-400/60 rounded-lg overflow-hidden"
                            style={{ boxShadow: '0 0 12px rgba(6,182,212,0.4), 0 0 24px rgba(6,182,212,0.15)' }}
                        >
                            {/* Eyes */}
                            <div className="flex justify-center gap-3 mt-2">
                                <motion.div
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.div
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                />
                            </div>

                            {/* Mouth bar */}
                            <div className="flex justify-center mt-1.5">
                                <motion.div
                                    className="h-1 bg-cyan-400/80 rounded-full"
                                    animate={{ width: ['30%', '70%', '30%'] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>

                            {/* Scan line */}
                            <motion.div
                                className="absolute left-0 w-full h-[2px] bg-cyan-400/40"
                                animate={{ y: [0, 40, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                    </div>

                    {/* Status text */}
                    <motion.span
                        className="font-mono text-xs text-cyan-400/70 tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        ANALYZING PROFILE...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// --- TRENDY ANIMATION COMPONENTS (2026) ---

// 1. Mouse-following glow spotlight
const MouseGlow = () => {
    const glowRef = useRef(null);
    const handleMouseMove = useCallback((e) => {
        if (glowRef.current) {
            glowRef.current.style.left = `${e.clientX}px`;
            glowRef.current.style.top = `${e.clientY + window.scrollY}px`;
            glowRef.current.style.opacity = '1';
        }
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (glowRef.current) glowRef.current.style.opacity = '0';
    }, []);
    useEffect(() => {
        const section = glowRef.current?.parentElement;
        if (!section) return;
        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', handleMouseLeave);
        return () => { section.removeEventListener('mousemove', handleMouseMove); section.removeEventListener('mouseleave', handleMouseLeave); };
    }, [handleMouseMove, handleMouseLeave]);
    return <div ref={glowRef} className="mouse-glow" style={{ opacity: 0 }} />;
};

// 2. Animated gradient mesh (morphing blobs)
const GradientMesh = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-30 top-1/4 left-1/4"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', animation: 'mesh-blob-1 12s ease-in-out infinite' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-25 top-1/3 right-1/4"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', animation: 'mesh-blob-2 15s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 bottom-1/4 left-1/3"
            style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)', animation: 'mesh-blob-3 18s ease-in-out infinite' }} />
    </div>
);

// 3. Typewriter text effect
const TypewriterText = ({ text, className = '' }) => {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) { setDisplayText(text.slice(0, i)); i++; }
            else clearInterval(interval);
        }, 60);
        return () => clearInterval(interval);
    }, [isInView, text]);
    useEffect(() => {
        const blink = setInterval(() => setShowCursor(c => !c), 530);
        return () => clearInterval(blink);
    }, []);
    return (
        <span ref={ref} className={className}>
            {displayText}
            <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }} className="text-blue-400">|</span>
        </span>
    );
};

// 4. Staggered word reveal for section titles
const StaggeredReveal = ({ text, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const words = text.split(' ');
    return (
        <span ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

// 5. 3D tilt card wrapper
const TiltCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        const shine = card.querySelector('.tilt-shine');
        if (shine) { shine.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`); shine.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`); }
    }, []);
    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        const inner = card.querySelector('.tilt-card-inner');
        if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }, []);
    return (
        <div ref={cardRef} className={`tilt-card ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="tilt-card-inner">
                <div className="tilt-shine"></div>
                {children}
            </div>
        </div>
    );
};

// 6. Scroll-triggered stat counter
const StatCounter = ({ end, suffix = '', label }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end]);
    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient" style={{ animation: isInView ? 'count-up-glow 1.5s ease-out' : 'none' }}>
                {count}{suffix}
            </div>
            <div className="text-xs text-white/30 font-light mt-1 tracking-wider uppercase">{label}</div>
        </div>
    );
};

// 7. Floating particle constellation
const ParticleField = () => {
    const particles = useRef(
        Array.from({ length: 18 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 15}s`,
            duration: `${15 + Math.random() * 20}s`,
            size: 1 + Math.random() * 2,
        }))
    ).current;
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-blue-400/40"
                    style={{
                        width: `${p.size}px`, height: `${p.size}px`,
                        left: p.left, bottom: '-10px',
                        animation: `particle-drift ${p.duration} linear infinite`,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

// --- SKILL BADGE ---
const SkillBadge = ({ skillName }) => {
    const badgeMap = {
        Python: 'https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54',
        'C/C++': 'https://img.shields.io/badge/C%2FC%2B%2B-00599C?style=for-the-badge&logo=cplusplus&logoColor=white',
        SQL: 'https://img.shields.io/badge/SQL-025E8C?style=for-the-badge&logo=microsoft-sql-server&logoColor=white',
        FastAPI: 'https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white',
        Docker: 'https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white',
        CMake: 'https://img.shields.io/badge/CMake-064F8C?style=for-the-badge&logo=cmake&logoColor=white',
        'Power Automate': 'https://img.shields.io/badge/Power%20Automate-0066FF?style=for-the-badge&logo=powerautomate&logoColor=white',
        Simulink: 'https://img.shields.io/badge/Simulink-D9230F?style=for-the-badge&logo=simulink&logoColor=white',
        SUMO: 'https://img.shields.io/badge/SUMO-76B900?style=for-the-badge&logo=eclipse-sumo&logoColor=white',
        Pandas: 'https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white',
        NumPy: 'https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white',
        PyTorch: 'https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white',
        Keras: 'https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white',
        TensorFlow: 'https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white',
        OpenCV: 'https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white',
        YOLOv8: 'https://img.shields.io/badge/YOLOv8-00FFFF?style=for-the-badge&logo=yolo&logoColor=black',
        MediaPipe: 'https://img.shields.io/badge/MediaPipe-0097A7?style=for-the-badge&logo=google&logoColor=white',
        GANs: 'https://img.shields.io/badge/GANs-FF6F00?style=for-the-badge',
        LangChain: 'https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white',
        'Gemini API': 'https://img.shields.io/badge/Gemini%20API-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white',
        'Reinforcement Learning': 'https://img.shields.io/badge/Reinforcement%20Learning-FFC107?style=for-the-badge',
        'Prompt Engineering': 'https://img.shields.io/badge/Prompt%20Engineering-9C27B0?style=for-the-badge',
        React: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
        PostgreSQL: 'https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white',
        pgvector: 'https://img.shields.io/badge/pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white',
        Streamlit: 'https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white',
        'Power BI': 'https://img.shields.io/badge/PowerBI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black',
        Excel: 'https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white',
        Tableau: 'https://img.shields.io/badge/Tableau-E97627?style=for-the-badge&logo=tableau&logoColor=white',
        SharePoint: 'https://img.shields.io/badge/SharePoint-0078D4?style=for-the-badge&logo=microsoft-sharepoint&logoColor=white',
        Confluence: 'https://img.shields.io/badge/Confluence-172B4D?style=for-the-badge&logo=confluence&logoColor=white',
        Jira: 'https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white',
        GitHub: 'https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white',
        N8N: 'https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white',
    };
    const url = badgeMap[skillName];
    if (!url) return null;
    return <img src={url} alt={`${skillName} skill badge`} className="transition-transform duration-300 transform hover:scale-110" />;
};

// --- HELPERS ---
const AnimateOnScroll = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }} animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
};

const Card = ({ children, className }) => (<div className={`glass-card overflow-hidden ${className || ''}`}>{children}</div>);



const Section = ({ id, title, subtitle, children }) => (
    <section id={id} className="py-32 md:py-44 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                    <StaggeredReveal text={title} />
                </h2>
                {subtitle && <p className="mt-4 text-lg md:text-xl text-white/40 font-light max-w-2xl mx-auto">{subtitle}</p>}
                <div className="mt-6 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            {children}
        </div>
    </section>
);

// --- HEADER ---
const Header = ({ activeSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isDark, setIsDark } = useContext(ThemeContext);
    const navLinks = ["roadmap", "skills", "projects", "assistant", "certifications", "blog", "contact"];
    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen ? 'bg-black/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.04]' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 h-14 flex justify-between items-center max-w-6xl">
                <a href="#" className="text-sm font-semibold text-white/90 tracking-tight">{portfolioData.personalInfo.name}</a>
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (<a key={link} href={`#${link}`} className={`relative text-xs font-medium tracking-wide capitalize transition-all duration-300 py-1 ${activeSection === link ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>{link}{activeSection === link && <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}</a>))}
                    {/* Dark/Light Toggle */}
                    <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all" aria-label="Toggle theme">
                        <motion.span
                            key={isDark ? 'moon' : 'sun'}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm"
                        >{isDark ? '🌙' : '☀️'}</motion.span>
                    </button>
                </div>
                <div className="flex items-center gap-3 md:hidden">
                    <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all z-50" aria-label="Toggle theme">
                        <motion.span animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.3 }} className="text-sm">{isDark ? '🌙' : '☀️'}</motion.span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 flex-shrink-0">
                        <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>{isMenuOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-2xl border-b border-white/[0.04]">
                    <div className="flex flex-col items-center gap-6 py-10">
                        {navLinks.map(link => (<a key={link} href={`#${link}`} onClick={() => setIsMenuOpen(false)} className={`text-sm font-light capitalize transition-colors duration-300 ${activeSection === link ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>{link}</a>))}
                    </div>
                </motion.div>
            )}</AnimatePresence>
        </motion.header>
    );
};

// --- HERO ---
const Hero = () => {
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const resumePreviewUrl = portfolioData.personalInfo.resumeUrl.replace('/view', '/preview');

    // Typewriter state
    const roles = [
        "AI ENGINEER FOR AUTONOMOUS SYSTEMS",
        "COMPUTER VISION ENGINEER",
        "LLM & RAG SYSTEMS BUILDER",
        "MASTER'S STUDENT @ THI GERMANY",
    ];
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    


    // Typewriter effect
    useEffect(() => {
        let currentText = '';
        let charIndex = 0;
        let isTyping = true;
        let timeout;

        const type = () => {
            const currentRole = roles[roleIndex];
            if (isTyping) {
                if (charIndex < currentRole.length) {
                    currentText += currentRole[charIndex];
                    setDisplayText(currentText);
                    charIndex++;
                    timeout = setTimeout(type, 60);
                } else {
                    isTyping = false;
                    timeout = setTimeout(type, 1500); // Wait before clearing
                }
            } else {
                setDisplayText('');
                setRoleIndex((prev) => (prev + 1) % roles.length);
                isTyping = true;
                charIndex = 0;
                currentText = '';
                timeout = setTimeout(type, 60); // Start next immediately
            }
        };

        timeout = setTimeout(type, 60);
        return () => clearTimeout(timeout);
    }, [roleIndex]);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setIsResumeOpen(false); };
        if (isResumeOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isResumeOpen]);

    return (
        <>
        <section id="hero" className="relative min-h-screen flex items-center justify-center bg-black px-6 py-20 overflow-hidden">
            {/* Magnetic cursor glow */}
            <MouseGlow />
            {/* Animated gradient mesh */}
            <GradientMesh />
            {/* Ambient background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)' }}></div>
                {/* Orbiting particles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-400/60 rounded-full" style={{ animation: 'orbit-1 15s linear infinite' }}></div>
                    <div className="w-1.5 h-1.5 bg-violet-400/40 rounded-full" style={{ animation: 'orbit-2 20s linear infinite' }}></div>
                    <div className="w-1 h-1 bg-cyan-400/50 rounded-full" style={{ animation: 'orbit-3 12s linear infinite' }}></div>
                </div>
            </div>
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <AnimateOnScroll className="flex justify-center order-1 md:order-1">
                        <div className="relative">
                            {/* Floating particles around image */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={`orb-${i}`}
                                    className="absolute w-2 h-2 rounded-full bg-blue-500/30"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                    animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
                                    transition={{
                                        duration: 3 + Math.random() * 3,
                                        delay: Math.random() * 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                            
                            {/* Static glowing profile wrapper */}
                            <div className="relative w-56 h-56 md:w-72 md:h-72">
                                <div style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                                    borderRadius: '50%',
                                    padding: '3px',
                                    boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(139,92,246,0.2)',
                                    width: '100%',
                                    height: '100%',
                                }}>
                                    <img src="/Profile pic.jpg" alt="Ashwin" className="rounded-full w-full h-full object-cover block" />
                                </div>
                            </div>
                        </div>
                    </AnimateOnScroll>
                    <div className="text-center md:text-left order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.0, duration: 0.6, ease: "easeOut" }}
                            className="mb-5 flex justify-center md:justify-start"
                        >
                            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-400"
                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="text-xs font-medium text-green-400 tracking-wide">Open to Opportunities</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                        >
                            <p className="text-sm font-medium text-white/40 tracking-widest uppercase mb-4 h-5 block">
                                <span className="text-blue-400">{displayText}</span>
                                <motion.span 
                                    animate={{ opacity: [1, 0] }} 
                                    transition={{ duration: 0.53, repeat: Infinity }}
                                >|</motion.span>
                            </p>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-6">Hi, I'm <span className="text-gradient">Ashwin</span></h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.30, duration: 0.6, ease: "easeOut" }}
                        >
                            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed max-w-xl mx-auto md:mx-0 mb-10">{portfolioData.personalInfo.bio}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                        >
                            <button onClick={() => setIsResumeOpen(true)} className="btn-premium btn-secondary"><DownloadIcon className="w-4 h-4 mr-2" /> View Resume</button>
                            <div className="flex items-center gap-4 justify-center">
                                <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"><GitHubIcon className="w-4 h-4" /></a>
                                <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"><LinkedInIcon className="w-4 h-4" /></a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

        {/* Resume Preview Modal */}
        <AnimatePresence>
            {isResumeOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={() => setIsResumeOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-4xl h-[85vh] bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsResumeOpen(false)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-sm"
                        >✕</button>

                        {/* Iframe */}
                        <iframe
                            src={resumePreviewUrl}
                            title="Resume Preview"
                            className="w-full flex-grow border-0"
                            allow="autoplay"
                        />

                        {/* Download link */}
                        <div className="p-4 border-t border-white/[0.06] flex justify-center">
                            <a href={portfolioData.personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-premium btn-primary text-sm px-6 py-2.5">
                                <DownloadIcon className="w-4 h-4 mr-2" /> Download Resume
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

// --- ROADMAP ---
const CareerRoadmapSection = () => (
    <Section id="roadmap" title="Career Roadmap" subtitle="Education & professional experience">
        <div className="relative border-l border-white/[0.06] pl-10 space-y-16 ml-2">
            {portfolioData.careerRoadmap.map((item, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                    <div className="relative">
                        <div className="absolute -left-[2.85rem] w-4 h-4 rounded-full border-2 border-blue-500/50 bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        </div>
                        <div className="glass-card p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-medium text-blue-400/80 tracking-wider uppercase">{item.period}</span>
                                <span className="px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">{item.type}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white/90 mb-1">{item.title}</h3>
                            <p className="text-sm text-white/40 font-light mb-3">{item.institution}</p>
                            <p className="text-sm text-white/30 font-light leading-relaxed whitespace-pre-line">{item.details}</p>
                            {item.paperUrl && (
                                <a href={item.paperUrl} target="_blank" rel="noopener noreferrer" className="btn-premium btn-secondary mt-4 text-sm px-5 py-2">
                                    <DownloadIcon className="w-3.5 h-3.5 mr-2" /> Download Paper
                                </a>
                            )}
                        </div>
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- SKILLS ---
const SkillsSection = () => (
    <Section id="skills" title="Skills" subtitle="Technologies & tools I work with">
        {/* Stat counters */}
        <AnimateOnScroll>
            <div className="grid grid-cols-3 gap-8 mb-16 max-w-lg mx-auto">
                <StatCounter end={9} suffix="+" label="Projects" />
                <StatCounter end={6} suffix="+" label="Certifications" />
                <StatCounter end={3} suffix="+" label="Years Exp" />
            </div>
        </AnimateOnScroll>
        <div className="space-y-10">
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
                <AnimateOnScroll key={category} delay={index * 100}>
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-semibold text-white/80 mb-6 tracking-tight">{category}</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            {skills.map((skill, si) => (
                                <div key={skill} style={{ transitionDelay: `${300 + si * 60}ms` }}>
                                    <SkillBadge skillName={skill} />
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- PROJECTS ---
const projectFilters = ["All", "Computer Vision", "NLP/RAG", "Autonomous Systems", "Tools"];

const ProjectsSection = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const { isDark } = useContext(ThemeContext);
    const filteredProjects = activeFilter === "All"
        ? portfolioData.projects
        : portfolioData.projects.filter(p => p.category === activeFilter);

    return (
        <Section id="projects" title="Projects" subtitle="Featured work & technical explorations">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {projectFilters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-300 ${
                            activeFilter === filter
                                ? `bg-blue-500/20 border border-blue-500/40 ${isDark ? 'text-blue-300' : 'text-blue-600'} shadow-[0_0_15px_rgba(59,130,246,0.25)]`
                                : `bg-white/[0.03] border border-white/[0.06] ${isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Project Grid */}
            <motion.div layout className="grid md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <TiltCard className="flex flex-col h-full group">
                                <Card className="flex flex-col h-full">
                                    <div className="relative">
                                        {project.visualComponent === 'LidarFusion' && <LidarFusionVisual />}
                                        {project.visualComponent === 'GenerativeAI' && <GenerativeAIVisual />}
                                        {project.visualComponent === 'ReinforcementLearning' && <RLVisual />}
                                        {project.visualComponent === 'Roundabout' && <RoundaboutVisual />}
                                        {project.visualComponent === 'RAGSystem' && <RAGSystemVisual />}
                                        {project.visualComponent === 'MiniCNN' && <MiniCNNVisual />}
                                        {project.visualComponent === 'BatSwing' && <BatSwingVisual />}
                                        {project.visualComponent === 'FaceRecon' && <FaceReconVisual />}
                                        {project.visualComponent === 'RadarAI' && <RadarAIVisual />}
                                        {project.visualComponent === 'Webhook' && <WebhookVisual />}
                                        {project.visualComponent === 'PortfolioAI' && <PortfolioAIVisual />}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-white/90 mb-3 tracking-tight">{project.title}</h3>
                                        <p className="text-sm text-white/35 font-light mb-6 flex-grow whitespace-pre-line leading-relaxed">{project.description}</p>
                                        <div className="mb-5 mt-auto">
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map(tech => (
                                                    <span key={tech} className="tech-tag">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center pt-4 border-t border-white/[0.04]">
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors duration-300"><GitHubIcon className="w-5 h-5" /></a>
                                        </div>
                                    </div>
                                </Card>
                            </TiltCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </Section>
    );
};

// --- AI ASSISTANT ---
const AIAssistantSection = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [jobFile, setJobFile] = useState(null);
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [inputMode, setInputMode] = useState('jd');
    const [matchScore, setMatchScore] = useState(null);

    const handleGenerate = async () => {
        if (!jobDesc.trim() && !jobFile) { setError(inputMode === 'jd' ? 'Please paste a job description or upload a file first.' : 'Please enter a job title first.'); return; }
        setIsGenerating(true);
        setError('');
        setGeneratedText('');
        setMatchScore(null);

        let finalJobDescription = jobDesc;
        const portfolioContext = JSON.stringify(portfolioData);
        let calculatedScore = null;

        try {
            let jobEmbedding;
            let resumeEmbedding = await embedJobDescription(portfolioContext);

            if (jobFile) {
                const arrayBuffer = await jobFile.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const bytes = Array.from(uint8Array);
                
                // Extract text from typed or pasted description as base context
                const baseTextContext = jobDesc ? `Job Notes: ${jobDesc}` : "Job Description PDF attachment.";
                
                try {
                    const multiResult = await embedMultimodal(baseTextContext, bytes);
                    jobEmbedding = multiResult;
                } catch (e) {
                   console.warn("Multimodal embedding failed, falling back to text only if available.", e);
                   if (jobDesc) {
                       const textResult = await embedJobDescription(jobDesc);
                       jobEmbedding = textResult;
                   } else {
                       throw new Error("Could not process PDF and no text description was provided.");
                   }
                }
                finalJobDescription = jobDesc ? `[PDF Attached] ${jobDesc}` : "[PDF Attached]";
            } else {
                if (inputMode === 'title') {
                     finalJobDescription = `The recruiter is looking for a candidate for the role: ${jobDesc}. Based on typical requirements for this role in the AI/autonomous systems industry, analyze Ashwin's fit.`;
                }
                const textResult = await embedJobDescription(finalJobDescription);
                jobEmbedding = textResult;
            }
            
            if (jobEmbedding && jobEmbedding.values && resumeEmbedding && resumeEmbedding.values) {
                 calculatedScore = (cosineSimilarity(jobEmbedding.values, resumeEmbedding.values) * 100).toFixed(1);
                 setMatchScore(calculatedScore);
            }

        } catch (e) {
            console.log('Embedding skipped or failed:', e);
            // Don't fail the whole process if embedding fails, just skip the match score
        }

        try {
            const prompt = `
            ${calculatedScore ? `Semantic Match Score: ${calculatedScore}% (calculated via Gemini Embedding 2)\n` : ''}
            You are an expert AI Recruiter Match Analysis tool. Your task is to deeply analyze Ashwin Muniappan's portfolio against a specific job description and produce a structured technical fit report.
            
            STRICT RULES:
            1. NEVER use "I," "me," or "my." ALWAYS refer to the candidate as "Ashwin" or "the candidate" in third person.
            2. Be specific — reference actual projects, certifications, and technologies from the portfolio.
            3. Tone: Objective, professional, and data-driven.
            
            OUTPUT FORMAT (use markdown):
            
            ## Match Score: [X]%
            A single overall fit percentage based on skills, experience, and project relevance. (If provided in the prompt above, use that semantic match score).
            
            ## ✅ Matching Skills
            Bullet list of skills from the portfolio that directly match the job requirements. For each, briefly cite the relevant project or experience.
            
            ## ⚠️ Skill Gaps
            Bullet list of required skills or qualifications the candidate currently lacks or has limited experience in.
            
            ## 🎯 Experience Alignment
            2-3 sentences on how the candidate's work experience, education, and projects map to the role's responsibilities.
            
            ## 💡 Recommendation
            2-3 sentences with a final verdict: is this a strong, moderate, or weak fit? Include one actionable suggestion for the candidate to strengthen their profile for this role.

            Job for Analysis: ${finalJobDescription}
            Candidate Portfolio: ${portfolioContext}
            `;

            const result = await generateFitReport(prompt);
            setGeneratedText(result);
        } catch (err) {
            console.error("AI Assistant Error:", err);
            setError(err.message || 'The AI service is currently busy. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Section id="assistant" title="AI Recruiter Assistant" subtitle="Paste a job description or enter a job title to get an AI-powered fit analysis">
            <AnimateOnScroll>
                <Card className="max-w-3xl mx-auto">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white/90 flex items-center tracking-tight"><BotIcon className="w-5 h-5 mr-2.5 text-blue-400" /> Technical Match Analysis</h3>
                            <span className="text-[9px] bg-blue-500/10 text-blue-400/80 border border-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold">AI Powered</span>
                        </div>
                        <AIAssistantVisual isGenerating={isGenerating} />

                        {/* Input Mode Toggle */}
                        <div className="flex gap-2 mt-5 mb-5">
                            <button
                                onClick={() => { setInputMode('jd'); setJobDesc(''); setError(''); }}
                                className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full transition-all duration-300 ${
                                    inputMode === 'jd'
                                        ? 'bg-blue-500/15 border border-blue-400/40 text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70'
                                }`}
                            >Paste Job Description</button>
                            <button
                                onClick={() => { setInputMode('title'); setJobDesc(''); setError(''); }}
                                className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full transition-all duration-300 ${
                                    inputMode === 'title'
                                        ? 'bg-blue-500/15 border border-blue-400/40 text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70'
                                }`}
                            >Enter Job Title</button>
                        </div>

                        {inputMode === 'jd' ? (
                            <>
                                <p className="text-white/30 mb-4 text-sm font-light">Paste a job description below for an objective analysis of Ashwin's technical fit.</p>
                                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste job description here..." className="input-apple h-40 resize-none font-mono text-sm mb-2" disabled={isGenerating} />
                                <div className="flex flex-col mb-4">
                                  <label className="text-xs text-white/50 mb-1">Optional: Upload Job Description PDF</label>
                                  <input
                                    type="file"
                                    accept=".pdf,.txt"
                                    onChange={(e) => setJobFile(e.target.files[0])}
                                    className="text-xs text-gray-400"
                                    disabled={isGenerating}
                                  />
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-white/30 mb-4 text-sm font-light">Enter a job title and we'll analyze Ashwin's fit based on typical industry requirements.</p>
                                <input type="text" value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="e.g. Computer Vision Engineer at BMW" className="input-apple font-mono text-sm mb-4" disabled={isGenerating} />
                            </>
                        )}

                        <button onClick={handleGenerate} disabled={isGenerating} className="btn-premium btn-primary w-full mt-4">
                            <SparklesIcon className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Analyzing Match...' : 'Generate Fit Report'}
                        </button>
                        {error && <p className="text-red-400/80 text-xs mt-4 text-center">{error}</p>}
                    </div>
                    {generatedText && (
                        <div className="border-t border-white/[0.04] p-6 md:p-8 bg-white/[0.01]">
                            {matchScore && (
                              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_4px_16px_rgba(59,130,246,0.1)]">
                                <div className="text-3xl font-bold text-blue-400 glow-text">{matchScore}%</div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-white/80 font-medium">Semantic Match</span>
                                    <span className="text-[10px] text-blue-400/60 font-mono tracking-wider">Powered by Gemini Embedding 2</span>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'soft-pulse 2s ease-in-out infinite' }}></div>
                                <h4 className="text-[10px] font-semibold text-blue-400/70 uppercase tracking-[0.15em]">Candidate Fit Report</h4>
                            </div>
                            <div className="glass-card p-5">
                                <div className="text-white/60 text-sm font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: generatedText
                                    .replace(/^## (.+)$/gm, '<h3 class="text-sm font-semibold text-blue-400/80 mt-5 mb-2">$1</h3>')
                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/80 font-medium">$1</strong>')
                                    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1.5 list-disc text-white/50">$1</li>')
                                    .replace(/(<li[^>]*>.*<\/li>)/gs, '<ul class="my-2">$1</ul>')
                                    .replace(/<\/ul>\s*<ul[^>]*>/g, '')
                                    .replace(/\n(?!<)/g, '<br/>')
                                }} />
                            </div>
                            <p className="text-[10px] text-white/20 mt-4 font-light">This report is an automated technical evaluation based on the candidate's verified portfolio data.</p>
                        </div>
                    )}
                </Card>
            </AnimateOnScroll>
        </Section>
    );
};

// --- CERTIFICATIONS ---
const CertificationsSection = () => (
    <Section id="certifications" title="Certifications" subtitle="Professional credentials & continuous learning">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.certifications.map((cert, index) => (
                <AnimateOnScroll key={index} delay={index * 80}>
                    <Card className="h-full">
                        <div className="p-6 md:p-8 flex flex-col h-full">
                            <h3 className="text-base font-semibold text-white/85 tracking-tight mb-2">{cert.name}</h3>
                            <p className="text-xs text-white/30 font-light uppercase tracking-wider mb-6">{cert.issuer}</p>
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center text-xs font-medium text-blue-400/70 hover:text-blue-400 transition-colors duration-300">View Credential <ExternalLinkIcon className="w-3 h-3 ml-1.5" /></a>
                        </div>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
    </Section>
);

// --- BLOG ---
const BlogSection = () => (
    <Section id="blog" title="Blog & Notes" subtitle="Reflections on building real-world AI systems">
        <div className="grid md:grid-cols-3 gap-8">
            {portfolioData.blogPosts.map((post, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                        <Card className="h-full">
                            <div className="p-6 md:p-8 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs text-white/30 font-light">{post.date}</span>
                                    <span className="text-xs text-white/20">·</span>
                                    <span className="text-xs text-white/30 font-light">{post.readTime}</span>
                                </div>
                                <h3 className="text-base font-semibold text-white/85 tracking-tight mb-3">{post.title}</h3>
                                <p className="text-sm text-white/35 font-light leading-relaxed mb-5 flex-grow">{post.summary}</p>
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase rounded-full bg-blue-500/10 border border-blue-500/15 text-blue-400/70">{tag}</span>
                                    ))}
                                </div>
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-blue-400/70 hover:text-blue-400 transition-colors duration-300">
                                    Read more <ExternalLinkIcon className="w-3 h-3 ml-1.5" />
                                </a>
                            </div>
                        </Card>
                    </motion.div>
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
        <Section id="contact" title="Get In Touch" subtitle="Let's connect and build something great">
            <AnimateOnScroll>
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0"><MailIcon className="w-4 h-4 text-white/40" /></div>
                            <div><h3 className="text-sm font-medium text-white/70 mb-1">Email</h3><p className="text-sm text-white/35 font-light">{portfolioData.personalInfo.email}</p></div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0"><PhoneIcon className="w-4 h-4 text-white/40" /></div>
                            <div><h3 className="text-sm font-medium text-white/70 mb-1">Phone</h3><p className="text-sm text-white/35 font-light">{portfolioData.personalInfo.phone}</p></div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0"><MapPinIcon className="w-4 h-4 text-white/40" /></div>
                            <div><h3 className="text-sm font-medium text-white/70 mb-1">Location</h3><p className="text-sm text-white/35 font-light">{portfolioData.personalInfo.location}</p></div>
                        </div>
                    </div>
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="input-apple" />
                            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="input-apple" />
                            <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="input-apple" />
                            <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows="4" className="input-apple resize-none"></textarea>
                            <button type="submit" disabled={isSubmitting} className="btn-premium btn-primary w-full mt-2">
                                <SendIcon className={`w-4 h-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} /> {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitStatus === 'success' && <p className="text-green-400/80 text-sm text-center font-light">Message sent successfully!</p>}
                            {submitStatus === 'error' && <p className="text-red-400/80 text-sm text-center font-light">Something went wrong. Please try again.</p>}
                        </form>
                    </Card>
                </div>
            </AnimateOnScroll>
        </Section>
    );
};

// --- FOOTER ---
const Footer = () => (
    <footer className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="section-divider mb-10"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-xs text-white/20 font-light">&copy; {new Date().getFullYear()} {portfolioData.personalInfo.name}. All rights reserved.</p>
                <div className="flex items-center gap-5">
                    <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors duration-300"><GitHubIcon className="w-4 h-4" /></a>
                    <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors duration-300"><LinkedInIcon className="w-4 h-4" /></a>
                </div>
            </div>
        </div>
    </footer>
);

// --- SCROLL TO TOP ---
const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setIsVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// --- AVATAR GUIDE ---
const tourSteps = [
  { section: 'hero',           emotion: 'wave',    message: "👋 Hey! I'm Ashwin — welcome! Let me show you around." ,           x: '38vw', y: '-60vh' },
  { section: 'roadmap',        emotion: 'nod',     message: "📚 Here's my journey — B.Tech in India to AI Engineering in Germany!", x: '10vw', y: '-45vh' },
  { section: 'skills',         emotion: 'flex',    message: "⚡ My core stack — PyTorch, OpenCV, LangChain, RAG systems and more.",         x: '60vw', y: '-50vh' },
  { section: 'projects',       emotion: 'excited', message: "🚀 These are my projects — from LiDAR fusion to full-stack RAG!",           x: '15vw', y: '-35vh' },
  { section: 'assistant',      emotion: 'think',   message: "🤖 Try my AI assistant — paste a job description and see how I match!", x: '55vw', y: '-55vh' },
  { section: 'certifications', emotion: 'proud',   message: "🎓 Certified by Anthropic, NVIDIA, Kaggle and more.",                  x: '25vw', y: '-40vh' },
  { section: 'contact',        emotion: 'bye',     message: "📬 Like what you see? I'm open to opportunities — let's connect!",     x: '42vw', y: '-30vh' },
];

const emotionAnimations = {
  wave: {
    rotate: [0, -30, 25, -20, 15, 0],
    y: [0, -20, -10, -15, 0],
    scale: [1, 1.1, 1.05, 1.1, 1],
    transition: { duration: 0.9, ease: "easeInOut" }
  },
  nod: {
    scaleY: [1, 0.85, 1.05, 0.9, 1],
    y: [0, 10, -5, 8, 0],
    transition: { duration: 0.7 }
  },
  flex: {
    scale: [1, 1.35, 0.95, 1.25, 1],
    rotate: [0, -10, 10, -5, 0],
    y: [0, -25, 0, -15, 0],
    transition: { duration: 0.7 }
  },
  excited: {
    y: [0, -40, 0, -30, 0, -20, 0],
    rotate: [0, -12, 12, -8, 8, 0],
    scale: [1, 1.2, 1, 1.15, 1],
    transition: { duration: 1.0 }
  },
  think: {
    rotate: [0, -20, 0, -15, 0],
    x: [0, -15, 0, -10, 0],
    scaleX: [1, 0.92, 1],
    transition: { duration: 0.8 }
  },
  proud: {
    scale: [1, 1.3, 1.1, 1.25, 1],
    y: [0, -30, -10, -20, 0],
    rotate: [0, 5, -5, 3, 0],
    transition: { duration: 0.7 }
  },
  bye: {
    rotate: [0, -25, 25, -25, 25, -25, 25, 0],
    y: [0, -10, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 1.2 }
  },
};

const emotionFilters = {
  wave:    "drop-shadow(0 0 12px rgba(59,130,246,0.9))",   // blue glow — friendly
  nod:     "drop-shadow(0 0 10px rgba(99,102,241,0.8))",   // purple — thoughtful
  flex:    "drop-shadow(0 0 14px rgba(234,179,8,0.9))",    // yellow — power
  excited: "drop-shadow(0 0 16px rgba(239,68,68,0.9))",   // red — hype
  think:   "drop-shadow(0 0 10px rgba(148,163,184,0.7))",  // gray — thinking
  proud:   "drop-shadow(0 0 14px rgba(34,197,94,0.9))",   // green — proud
  bye:     "drop-shadow(0 0 12px rgba(251,146,60,0.9))",  // orange — warm goodbye
};

const getScreenConfig = () => {
  const W = window.innerWidth;
  const isMobile = W < 640;
  const isTablet = W >= 640 && W < 1024;
  return {
    avatarSize: isMobile ? 'w-20 h-20' : isTablet ? 'w-28 h-28' : 'w-36 h-36',
    bubbleWidth: isMobile ? 'w-52' : isTablet ? 'w-64' : 'w-72',
    fontSize: isMobile ? 'text-xs' : 'text-sm',
    isMobile,
  };
};

const AvatarGuide = () => {
    const [tourActive, setTourActive] = useState(() => !sessionStorage.getItem('toured'));
    const [currentStep, setCurrentStep] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [screenConfig, setScreenConfig] = useState(getScreenConfig);

    useEffect(() => {
        const handleResize = () => setScreenConfig(getScreenConfig());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!tourActive) return;

        if (!hasStarted) {
            setTimeout(() => {
                setHasStarted(true);
                sessionStorage.setItem('toured', 'true');
            }, 1000);
        }

        const sectionIds = tourSteps.map(s => s.section);
        const observers = [];

        sectionIds.forEach((id, index) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            console.log('Section visible:', id, 'index:', index);
                            setCurrentStep(index);
                        }
                    });
                },
                {
                    threshold: 0.05,
                    rootMargin: '0px 0px -20% 0px'
                }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => {
            observers.forEach(o => o.disconnect());
        };
    }, [tourActive, hasStarted]);

    // Fallback scroll listener for tall sections
    useEffect(() => {
        if (!tourActive) return;

        const handleScroll = () => {
            const scrollY = window.scrollY + window.innerHeight * 0.4;
            tourSteps.forEach((step, index) => {
                const el = document.getElementById(step.section);
                if (!el) return;
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    setCurrentStep(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tourActive]);

    const handleRestart = () => {
        setCurrentStep(0);
        setHasStarted(true);
        setTourActive(true);
        document.getElementById(tourSteps[0].section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const getPositions = () => {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const isMobile = W < 640;
        const avatarW = isMobile ? 80 : 130;
        const bubbleW = isMobile ? 200 : 260;
        const rightEdge = W - avatarW - 16;   // fully inside right edge
        const leftEdge  = 16;                  // fully inside left edge
        const rightBubbleEdge = W - bubbleW - 16; // when bubble opens left

        return [
            { x: rightEdge,      y: H * 0.30 },   // hero — right
            { x: leftEdge,       y: H * 0.38 },   // roadmap — left
            { x: rightEdge,      y: H * 0.45 },   // skills — right
            { x: leftEdge,       y: H * 0.50 },   // projects — left
            { x: rightEdge,      y: H * 0.28 },   // assistant — right top
            { x: leftEdge,       y: H * 0.35 },   // certifications — left
            { x: rightEdge,      y: H * 0.55 },   // contact — right
        ];
    };

    const avatarPx = screenConfig.isMobile ? 80 : 144;
    const bubbleH = 140;
    const pos = getPositions()[currentStep] || getPositions()[0];
    const safePos = {
        x: Math.min(Math.max(pos.x, 10), window.innerWidth - avatarPx - 10),
        y: Math.min(Math.max(pos.y, bubbleH), window.innerHeight - avatarPx - bubbleH),
    };

    const bubbleClass = screenConfig.isMobile
        ? 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2'
        : safePos.x > window.innerWidth * 0.55
            ? 'absolute bottom-full right-0 mb-2'
            : 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2';

    

    const handleAvatarClick = () => {
        if (!tourActive) {
            setCurrentStep(0);
            setTourActive(true);
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isRightSide = safePos.x > window.innerWidth / 2;

    return (
        <motion.div 
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
            animate={{ x: safePos.x, y: safePos.y }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
            <div 
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* BUBBLE — always directly above avatar */}
                <AnimatePresence mode="wait">
                    {(tourActive && hasStarted) ? (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto',
                                background: 'white',
                                position: 'absolute',
                                bottom: '100%',
                                ...(isRightSide ? { right: 0 } : { left: 0 }),
                                borderRadius: '16px',
                                padding: '12px 16px',
                                marginBottom: '8px',
                                width: screenConfig.isMobile ? '200px' : '260px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: screenConfig.isMobile ? '12px' : '13px',
                                color: '#1f2937',
                                fontWeight: 500,
                            }}
                        >
                            <p style={{ margin: '0 0 10px 0', lineHeight: '1.4' }}>{tourSteps[currentStep].message}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {tourSteps.map((_, i) => (
                                        <div key={i} style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: i === currentStep ? '#2563eb' : '#cbd5e1',
                                            transition: 'background 0.3s'
                                        }} />
                                    ))}
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTourActive(false);
                                    }}
                                    style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontWeight: 'bold' }}
                                >
                                    ✕
                                </button>
                            </div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '6px', marginBottom: 0 }}>
                                scroll to explore ↓
                            </p>
                        </motion.div>
                    ) : (!tourActive && isHovered) ? (
                        <motion.div
                            key="idle-bubble"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                pointerEvents: 'auto',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                marginBottom: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: '12px',
                                color: '#1f2937',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Click to restart 👆
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* AVATAR — directly below bubble */}
                <motion.img 
                    key={`avatar-${currentStep}`}
                    src={avatarEmoji}
                    animate={hasStarted ? emotionAnimations[tourSteps[currentStep].emotion] : {}}
                    onClick={handleAvatarClick}
                    style={{
                        pointerEvents: 'auto',
                        cursor: tourActive ? 'default' : 'pointer',
                        width: screenConfig.isMobile ? '80px' : '130px',
                        height: screenConfig.isMobile ? '80px' : '130px',
                        objectFit: 'contain',
                        filter: emotionFilters[tourSteps[currentStep].emotion],
                        display: 'block',
                    }}
                    onError={(e) => console.log('Avatar load error:', e)}
                />
            </div>
        </motion.div>
    );
};

// --- APP ---
export default function App() {
    const [activeSection, setActiveSection] = useState('hero');
    const [isDark, setIsDark] = useState(true);
    const sectionRefs = { hero: useRef(null), roadmap: useRef(null), skills: useRef(null), projects: useRef(null), assistant: useRef(null), certifications: useRef(null), blog: useRef(null), contact: useRef(null) };
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
        }, { rootMargin: '-30% 0px -70% 0px' });
        Object.values(sectionRefs).forEach(r => r.current && observer.observe(r.current));
        return () => observer.disconnect();
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen font-sans transition-colors duration-500`}>
                <ParticleField />
                <Header activeSection={activeSection} />
                <main>
                    <div id="hero" ref={sectionRefs.hero}><Hero /></div>
                    <div className="section-divider"></div>
                    <div id="roadmap" ref={sectionRefs.roadmap}><CareerRoadmapSection /></div>
                    <div className="section-divider"></div>
                    <div id="skills" ref={sectionRefs.skills}><SkillsSection /></div>
                    <div className="section-divider"></div>
                    <div id="projects" ref={sectionRefs.projects}><ProjectsSection /></div>
                    <div className="section-divider"></div>
                    <div id="assistant" ref={sectionRefs.assistant}><AIAssistantSection /></div>
                    <div className="section-divider"></div>
                    <div id="certifications" ref={sectionRefs.certifications}><CertificationsSection /></div>
                    <div className="section-divider"></div>
                    <div id="blog" ref={sectionRefs.blog}><BlogSection /></div>
                    <div className="section-divider"></div>
                    <div id="contact" ref={sectionRefs.contact}><ContactSection /></div>
                </main>
                <Footer />
                <ScrollToTop />
                <AvatarGuide />
            </div>
        </ThemeContext.Provider>
    );
}

