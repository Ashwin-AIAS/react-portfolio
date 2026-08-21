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
  // Weighted roughly 60% computer vision / perception, 40% generative AI,
  // agents and robotics — the split the roadmap and the projects actually
  // reflect. Ordering is deliberate: the section renders these keys in place,
  // so vision leads and the production stack closes.
  skills: {
    "Computer Vision & Perception": ["OpenCV", "YOLOv8 / YOLO26", "MediaPipe", "3D Reconstruction", "Pose Biomechanics", "CNNs", "PyTorch", "Int8 Quantization", "Edge AI (C/C++)", "TensorFlow"],
    "Generative AI & Autonomous Agents": ["LangChain", "LLMs (Claude / Gemini / GPT-4)", "Autonomous AI Agents", "RAG & Graph RAG", "Vector DBs (pgvector, ChromaDB)", "OpenAI Whisper", "Prompt Engineering"],
    "Robotics & Autonomous Systems": ["Sensor Fusion", "LiDAR & RADAR", "SUMO Simulation", "Simulink", "ROS Kinematics", "Kalman Filtering"],
    "Full-Stack & Production Core": ["FastAPI", "Python", "C/C++", "React", "PostgreSQL", "Docker", "CMake", "Redis", "Git", "N8N"],
  },
  projects: [
    {
      title: "GymVision (PoseCoach) — Real-Time AI Gym Form Coach",
      description: "• Built a real-time exercise form correction system using YOLO26-Pose keypoint detection streamed over WebSockets, with EMA smoothing, rep counting, and per-joint form scoring.\n• Integrated an AI coaching chatbot powered by Gemini + ChromaDB (RAG) with SSE streaming and reference-video guidance.\n• Full-stack PWA: FastAPI, PostgreSQL & Redis backend with a React + TypeScript frontend, deployed via Docker on Vercel, Render, and Modal GPU.",
      technologies: ["Python", "FastAPI", "YOLO26-Pose", "React", "TypeScript", "Gemini API", "ChromaDB", "PostgreSQL", "Redis", "Docker"],
      visualComponent: 'GymVision',
      githubUrl: "https://github.com/Ashwin-AIAS/posecoach",
      liveUrl: "https://posecoach-rho.vercel.app",
      category: "AI / Computer Vision",
      featured: true,
      metric: "Live demo — real-time rep counting & form scoring"
    },
    {
      title: "JARVIS — Voice-Controlled AI Terminal Agent",
      description: "• Built a voice-controlled AI agent using OpenAI Whisper for speech recognition and Claude API for command execution.\n• Streams results to a real-time React dashboard in under 3 seconds.\n• Full-stack architecture featuring FastAPI, PostgreSQL, Redis, and ChromaDB (RAG), containerized with Docker.",
      technologies: ["Python", "FastAPI", "React", "OpenAI Whisper", "Claude API", "ChromaDB", "Docker", "PostgreSQL", "Redis"],
      visualComponent: 'Jarvis',
      githubUrl: "https://github.com/Ashwin-AIAS/jarvis-terminal-agent",
      liveUrl: "#",
      category: "AI / Full-Stack",
      featured: true,
      metric: "Voice command to dashboard in under 3 seconds"
    },
    {
      title: "RAG System — Full-Stack Retrieval-Augmented Generation",
      description: "• Built a full-stack RAG system with document ingestion, semantic & hybrid retrieval, and grounded generation.\n• Implemented cross-encoder reranking and optional Graph RAG via Neo4j.\n• Features conversation history, feedback system, and admin analytics dashboard.",
      technologies: ["FastAPI", "React", "PostgreSQL", "pgvector", "Docker", "Gemini API", "LangChain"],
      visualComponent: 'RAGSystem',
      githubUrl: "https://github.com/Ashwin-AIAS/rag-foundation-pgvector",
      liveUrl: "#",
      category: "NLP/RAG",
      featured: true,
      metric: "Hybrid retrieval + cross-encoder reranking + Graph RAG"
    },
    {
      title: "Mini-CNN Framework",
      description: "• Implemented a custom LeNet-5 inference engine from scratch in C/C++.\n• Optimized with HPC techniques including Im2Col for cache locality.\n• Simulated Int8 quantization and integer arithmetic for edge hardware deployment.",
      technologies: ["C/C++", "CMake", "LeNet-5", "Int8 Quantization", "HPC"],
      visualComponent: 'MiniCNN',
      githubUrl: "https://github.com/Ashwin-AIAS/Mini-CNN-Framework",
      liveUrl: "#",
      category: "Computer Vision",
      featured: true,
      metric: "Zero frameworks — pure C/C++ with Int8 quantization"
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
      description: "• Advanced camera-LiDAR fusion models.\n• Led the setup of a development environment on Jetson Nano.\n• Performed data preprocessing for large-scale KITTI and Waymo datasets.\n• Utilized Git and Jira for collaborative project management.",
      technologies: ["Python", "PyTorch", "Keras", "OpenCV", "Jetson Nano", "Git", "Jira"],
      visualComponent: 'LidarFusion',
      githubUrl: "https://github.com/Ashwin-AIAS/Lidar-Camera-Radar",
      liveUrl: "#",
      category: "Autonomous Systems"
    },
    {
      title: "Coordination of Automated Vehicles at Roundabouts",
      description: "• Conducted competitive and scenario analysis to evaluate various mobility strategies.\n• Contributed to roadmap recommendations for advanced traffic systems.\n• Utilized SUMO and Simulink for traffic flow simulation.",
      technologies: ["SUMO", "Simulink", "Python", "Scenario Analysis"],
      visualComponent: 'Roundabout',
      githubUrl: "https://github.com/Ashwin-AIAS/intelligent-transportation-systems",
      liveUrl: "#",
      category: "Autonomous Systems"
    },
    {
      title: "Custom RL Environment: 'Road to Mr. Olympia 2024'",
      description: "• Developed AI agents using reinforcement learning (Q-Learning, PPO).\n• Simulated complex, multi-stage decision-making in a custom Python environment.\n• Focused on optimizing long-term rewards.",
      technologies: ["Python", "Reinforcement Learning", "Q-Learning", "PPO"],
      visualComponent: 'ReinforcementLearning',
      githubUrl: "https://github.com/Ashwin-AIAS/Custom-Python-Environment-for-Autonomous-Systems-called-Road-to-Mr.Olympia-2024-",
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
      githubUrl: "https://github.com/Ashwin-AIAS/react-portfolio",
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
      issuer: "NVIDIA",
      credentialUrl: "https://learn.nvidia.com/certificates?id=n-bm0zFoTnigmiwDZdSKnw#"
    },
    {
      name: "Prompt Engineering for ChatGPT",
      issuer: "Great Learning",
      credentialUrl: "https://www.mygreatlearning.com/certificate/SLUQCJZG"
    }
  ]
};
