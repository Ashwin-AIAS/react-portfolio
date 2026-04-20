export const portfolioData = {
  personalInfo: {
    name: "Ashwin",
    title: "AI Engineer for Autonomous Systems",
    bio: "Master's student in AI Engineering at THI Germany, with a background in Mechanical Engineering and production experience building computer vision pipelines, full-stack RAG systems, and LLM-powered tools. Former ERP Analyst at DXC Technology. Focused on bridging AI research and real-world deployment in autonomous systems.",
    email: "mashwinvignesh@gmail.com",
    phone: "+49 15560090137",
    location: "Ingolstadt, Germany",
    github: "https://github.com/Ashwin-AIAS",
    linkedin: "https://www.linkedin.com/in/ashwin-aias",
    resumeUrl: "/Ashwin_Vignesh_M_Resume.pdf"
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
      title: "JARVIS — Voice-Controlled AI Terminal Agent",
      description: "• Built a voice-controlled AI agent using OpenAI Whisper for speech recognition and Claude API for command execution.\n• Streams results to a real-time React dashboard in under 3 seconds.\n• Full-stack architecture featuring FastAPI, PostgreSQL, Redis, and ChromaDB (RAG), containerized with Docker.",
      technologies: ["Python", "FastAPI", "React", "OpenAI Whisper", "Claude API", "ChromaDB", "Docker", "PostgreSQL", "Redis"],
      visualComponent: 'Jarvis',
      githubUrl: "https://github.com/Ashwin-AIAS",
      liveUrl: "#",
      category: "AI / Full-Stack"
    },
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
      title: "JARVIS: Building a Voice-Controlled AI Agent",
      summary: "Exploring the challenges of low-latency speech recognition and command execution using OpenAI Whisper and Claude API. A deep dive into real-time streaming architecture.",
      tags: ["AI", "FastAPI", "Voice"],
      date: "Apr 2026",
      readTime: "10 min read",
      url: "https://github.com/Ashwin-AIAS"
    },
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
