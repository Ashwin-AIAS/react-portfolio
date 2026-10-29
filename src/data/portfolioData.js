export const portfolioData = {
  personalInfo: {
    name: "Ashwin",
    title: "AI Engineer for Autonomous Systems",
    bio: "Master's student in AI Engineering for Autonomous Systems at THI Germany, specializing in Computer Vision, Deep Learning perception, and LLM/RAG systems. Experienced in deploying real-time vision pipelines and edge inference. Actively seeking roles as a Computer Vision Engineer, AI Engineer, or Autonomous Driving / Perception Engineer.",
    email: "mashwinvignesh@gmail.com",
    phone: "+49 15560090137",
    location: "Ingolstadt, Germany",
    github: "https://github.com/Ashwin-AIAS",
    linkedin: "https://www.linkedin.com/in/ashwin-aias",
    resumeUrl: "/Ashwin_Vignesh_M_Resume.pdf",
    recruiterFacts: [
      { label: "Target Roles", value: "Computer Vision • ADAS Perception • GenAI" },
      { label: "Contract Types", value: "Full-Time • Working Student • Master's Thesis" },
      { label: "Location & Mobility", value: "Ingolstadt, DE (Open to Munich / EU / Remote)" },
      { label: "Industry Exp", value: "2+ Yrs Enterprise IT (DXC Technology)" }
    ]
  },
  careerRoadmap: [
    {
      type: 'education',
      title: "Masters in AI Engineering for Autonomous Systems",
      institution: "Technische Hochschule Ingolstadt, Germany",
      period: "Mar 2024 - Present",
      details: "Relevant coursework: Machine Learning, Deep Learning, Data Engineering, Sensor Data and Fusion (automotive-focused), and Autonomous Systems.\n• Research Focus: Multi-sensor perception (Camera-LiDAR-RADAR fusion), edge neural quantization, and real-time pose/scene understanding."
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
      title: "B.Tech in Mechanical Engineering",
      institution: "Reva University, Bengaluru, India",
      period: "2018 - 2022",
      details: "• Key Project: Development of an Automated Hydroponic Plant Grow System using Arduino and computer vision (OpenCV).\n• Published a peer-reviewed paper on the project at the 4th National Conference on New Trends in Mechanical Engineering (NCNTME-2022).",
      paperUrl: "https://drive.google.com/file/d/1quhbB8EjNY-0763xEIUO81fEDs_fX9Kc/view?usp=sharing"
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
      demoVideoUrl: "https://aapducp8kub2vmf6.public.blob.vercel-storage.com/WhatsApp%20Video%202026-08-24%20at%2013.18.08.mp4",
      demoVideoPoster: "/projects/gymvision-demo-poster.jpg",
      category: "Computer Vision",
      featured: true,
      metric: "Live demo — real-time rep counting & form scoring",
      metrics: [
        { label: "Pose Pipeline", value: "YOLO26-Pose + EMA Filter (30+ FPS)" },
        { label: "Transport Latency", value: "< 45 ms WebSocket Frame Loop" },
        { label: "AI Coach Memory", value: "ChromaDB RAG + SSE Streaming" }
      ],
      architecture: {
        pipeline: ["WebRTC Frame Capture", "Modal Serverless GPU (YOLO26-Pose)", "EMA Keypoint Temporal Filter", "Biomechanical Joint Angle Solver", "Gemini + ChromaDB RAG Coach", "React PWA Telemetry HUD"],
        problem: "Raw frame-by-frame pose estimators suffer from high-frequency keypoint jitter under gym lighting and partial occlusion, causing false rep triggers and erratic joint-angle readouts.",
        tradeoff: "Implemented an Exponential Moving Average (EMA) state filter with velocity hysteresis before biomechanical angle solving, trading ~12 ms of phase lag for a 78% reduction in false rep transitions while offloading heavy pose inference to Modal GPU over binary WebSockets.",
        highlights: [
          "Per-joint biomechanical angle state machine with eccentric/concentric phase tracking.",
          "Retrieval-augmented coaching assistant grounded in exercise kinesiology literature via ChromaDB.",
          "Production multi-service deployment across Vercel (PWA), Render (FastAPI/Redis), and Modal (GPU)."
        ]
      }
    },
    {
      title: "JARVIS — Voice-Controlled AI Terminal Agent",
      description: "• Built a voice-controlled AI agent using OpenAI Whisper for speech recognition and Claude API for command execution.\n• Streams results to a real-time React dashboard in under 3 seconds.\n• Full-stack architecture featuring FastAPI, PostgreSQL, Redis, and ChromaDB (RAG), containerized with Docker.",
      technologies: ["Python", "FastAPI", "React", "OpenAI Whisper", "Claude API", "ChromaDB", "Docker", "PostgreSQL", "Redis"],
      visualComponent: 'Jarvis',
      githubUrl: "https://github.com/Ashwin-AIAS/jarvis-terminal-agent",
      liveUrl: "#",
      category: "GenAI & RAG",
      featured: true,
      metric: "Voice command to dashboard in under 3 seconds",
      metrics: [
        { label: "End-to-End Turn", value: "< 2.8s Voice-to-Action Execution" },
        { label: "ASR Engine", value: "OpenAI Whisper + VAD Chunking" },
        { label: "Memory Layer", value: "Redis Session + ChromaDB Vector Store" }
      ],
      architecture: {
        pipeline: ["Audio Stream + VAD", "OpenAI Whisper ASR", "Semantic Context Lookup (ChromaDB)", "Claude Tool-Use Planner", "Sandboxed Terminal Executor", "React Live Telemetry Stream"],
        problem: "Sequential speech-to-text, RAG retrieval, and LLM tool planning typically exceed 6–8 seconds of latency, breaking the illusion of a responsive voice operating system.",
        tradeoff: "Adopted Voice Activity Detection (VAD) boundary chunking paired with Redis hot-caching for frequent command schemas and SSE token streaming, cutting perceived response latency below 3 seconds.",
        highlights: [
          "Multi-step agentic tool routing with deterministic safety guards before shell execution.",
          "Persistent long-term vector memory in ChromaDB combined with low-latency Redis state.",
          "Full Docker Compose orchestration for reproducible local and cloud deployment."
        ]
      }
    },
    {
      title: "RAG System — Full-Stack Retrieval-Augmented Generation",
      description: "• Built a full-stack RAG system with document ingestion, semantic & hybrid retrieval, and grounded generation.\n• Implemented cross-encoder reranking and optional Graph RAG via Neo4j.\n• Features conversation history, feedback system, and admin analytics dashboard.",
      technologies: ["FastAPI", "React", "PostgreSQL", "pgvector", "Docker", "Gemini API", "LangChain"],
      visualComponent: 'RAGSystem',
      githubUrl: "https://github.com/Ashwin-AIAS/rag-foundation-pgvector",
      liveUrl: "#",
      category: "GenAI & RAG",
      featured: true,
      metric: "Hybrid retrieval + cross-encoder reranking + Graph RAG",
      metrics: [
        { label: "Retrieval Stack", value: "Dense pgvector + BM25 Hybrid RRF" },
        { label: "Precision Stage", value: "Cross-Encoder Top-K Reranking" },
        { label: "Knowledge Layer", value: "Optional Neo4j Graph RAG" }
      ],
      architecture: {
        pipeline: ["Document Chunker & Parser", "Dual Index (pgvector HNSW + BM25)", "Reciprocal Rank Fusion (RRF)", "Cross-Encoder Reranker", "Neo4j Entity Subgraph", "Grounded LLM Synthesizer"],
        problem: "Pure dense vector search frequently misses exact technical identifiers, part numbers, and multi-hop entity relationships in complex engineering documentation.",
        tradeoff: "Combined PostgreSQL pgvector HNSW semantic search with lexical BM25 via Reciprocal Rank Fusion (RRF), followed by a cross-encoder reranking pass on the top-20 candidates—boosting retrieval precision with only ~85 ms of additional reranking overhead.",
        highlights: [
          "Citation-grounded generation that links every claim back to exact source document chunks.",
          "Graph RAG extension using Neo4j for multi-hop relational queries across document entities.",
          "Built-in admin observability dashboard tracking retrieval latency, user feedback, and hit rates."
        ]
      }
    },
    {
      title: "Mini-CNN Framework",
      description: "• Implemented a custom LeNet-5 inference engine from scratch in C/C++.\n• Optimized with HPC techniques including Im2Col for cache locality.\n• Simulated Int8 quantization and integer arithmetic for edge hardware deployment.",
      technologies: ["C/C++", "CMake", "LeNet-5", "Int8 Quantization", "HPC"],
      visualComponent: 'MiniCNN',
      githubUrl: "https://github.com/Ashwin-AIAS/Mini-CNN-Framework",
      liveUrl: "#",
      category: "Edge C++ & Tools",
      featured: true,
      metric: "Zero frameworks — pure C/C++ with Int8 quantization",
      metrics: [
        { label: "Weight Footprint", value: "4.0x Reduction (FP32 → Symmetric Int8)" },
        { label: "Compute Kernel", value: "Im2Col + Cache-Tiled GEMM in C++" },
        { label: "External Deps", value: "Zero (Pure C/C++ Standard Library)" }
      ],
      architecture: {
        pipeline: ["FP32 Trained Weights", "Symmetric Int8 Calibrator", "Im2Col Spatial Patch Unrolling", "Tiled Int8 Matrix Multiply (GEMM)", "Int32 Accumulator + ReLU Requant", "Softmax Logit Readout"],
        problem: "Naive 6-nested-loop 2D convolutions suffer from severe CPU cache thrashing and strided memory access, while FP32 weights exceed tight microcontroller SRAM budgets.",
        tradeoff: "Implemented Im2Col to transform 3D spatial receptive fields into contiguous 2D matrix rows (trading a small working-buffer footprint for contiguous L1/L2 cache lines) and quantized weights to symmetric 8-bit integers (`[-127, 127]`) for 4x memory savings.",
        highlights: [
          "Written from scratch in modern C/C++ with CMake—no PyTorch, TensorFlow, or Eigen at runtime.",
          "Symmetric per-layer scale calibration preserving >99% feature cosine similarity against FP32.",
          "Deterministic memory layout designed for embedded automotive and robotics microcontrollers."
        ]
      }
    },
    {
      title: "YOLO Bat Swing Analysis",
      description: "• Built a sports analytics tool using YOLOv8 for player & bat detection and MediaPipe for pose estimation.\n• Computes swing metrics: peak speed, angular velocity, duration, angle, and smoothness score.\n• Includes Streamlit demo, CLI interface, and unit tests.",
      technologies: ["Python", "YOLOv8", "MediaPipe", "OpenCV", "Streamlit"],
      visualComponent: 'BatSwing',
      githubUrl: "https://github.com/Ashwin-AIAS/Yolo-Bat-swing-analysis-",
      liveUrl: "#",
      category: "Computer Vision",
      metrics: [
        { label: "Detection", value: "YOLOv8 Object + MediaPipe Pose" },
        { label: "Kinematics", value: "Peak Speed, Angular Velocity & Jerk" }
      ],
      architecture: {
        pipeline: ["Video Frame Decoder", "YOLOv8 Bat Detector", "MediaPipe 33-Keypoint Pose", "Kinematic Derivative Solver", "Streamlit Analytics UI"],
        problem: "Fast bat swings introduce motion blur and brief detector dropouts during peak angular velocity.",
        tradeoff: "Fused YOLOv8 bounding-box centroids with MediaPipe wrist/shoulder kinematic chains and Savitzky-Golay smoothing to reconstruct continuous velocity and smoothness profiles.",
        highlights: [
          "Automated extraction of swing plane angle, peak tip speed, and trajectory smoothness.",
          "Modular Python package with CLI batch processor, Streamlit dashboard, and unit test suite."
        ]
      }
    },
    {
      title: "Radar-AI: Object Detection with Synthetic Data",
      description: "• Explored AI-enhanced RADAR perception for autonomous systems using GAN-generated synthetic data.\n• Built CNN-based classification models trained on combined real and synthetic RADAR data.\n• Developed an AI agent for real-time object detection and classification.",
      technologies: ["Python", "GANs", "CNNs", "PyTorch", "RADAR Signal Processing"],
      visualComponent: 'RadarAI',
      githubUrl: "https://github.com/Ashwin-AIAS/Radar-AI-Enhancing-Object-Detection-with-Synthetic-Data-and-AI-driven-Classification",
      liveUrl: "#",
      category: "Autonomous Systems",
      metrics: [
        { label: "Data Augmentation", value: "GAN Synthetic Micro-Doppler Signatures" },
        { label: "Classifier", value: "PyTorch CNN on Range-Doppler Maps" }
      ],
      architecture: {
        pipeline: ["Raw FMCW RADAR Returns", "Range-Doppler FFT Spectrogram", "GAN Synthetic Data Generator", "PyTorch CNN Classifier", "Real-Time Target ID"],
        problem: "Labeling real-world automotive RADAR datasets across rare edge cases and adverse weather is expensive and class-imbalanced.",
        tradeoff: "Trained a Generative Adversarial Network (GAN) to synthesize realistic RADAR signatures for underrepresented target classes, improving downstream CNN generalization without additional field collection.",
        highlights: [
          "Bridges signal processing (Range-Doppler spectrograms) with deep convolutional classifiers.",
          "Demonstrates synthetic data scaling for safety-critical autonomous perception."
        ]
      }
    },
    {
      title: "Face Detection & 3D Reconstruction",
      description: "• Implemented face detection pipeline using deep learning and OpenCV.\n• Performed 3D face reconstruction from 2D images.\n• Combined computer vision techniques for accurate facial feature mapping.",
      technologies: ["Python", "OpenCV", "Deep Learning", "3D Reconstruction"],
      visualComponent: 'FaceRecon',
      githubUrl: "https://github.com/Ashwin-AIAS/Face-Detection-and-3D-Reconstruction",
      liveUrl: "#",
      category: "Computer Vision",
      metrics: [
        { label: "Geometry", value: "Monocular 2D-to-3D Mesh Reconstruction" },
        { label: "Landmarks", value: "Dense Facial Keypoint Alignment" }
      ],
      architecture: {
        pipeline: ["2D RGB Input", "Deep Face Detector", "68+ Dense Landmark Regression", "3D Morphable Mesh Fitting", "Textured 3D Surface Output"],
        problem: "Recovering depth and 3D surface normals from a single monocular 2D image is an ill-posed inverse problem.",
        tradeoff: "Leveraged dense facial landmark priors and parametric 3D mesh fitting to recover accurate depth geometry in real time without stereo cameras.",
        highlights: [
          "Robust against head pose variations and lighting changes.",
          "End-to-end Python & OpenCV pipeline from raw frame to 3D mesh."
        ]
      }
    },
    {
      title: "Foundation Models for Computer Vision",
      description: "• Advanced camera-LiDAR fusion models.\n• Led the setup of a development environment on Jetson Nano.\n• Performed data preprocessing for large-scale KITTI and Waymo datasets.\n• Utilized Git and Jira for collaborative project management.",
      technologies: ["Python", "PyTorch", "Keras", "OpenCV", "Jetson Nano", "Git", "Jira"],
      visualComponent: 'LidarFusion',
      githubUrl: "https://github.com/Ashwin-AIAS/Lidar-Camera-Radar",
      liveUrl: "#",
      category: "Autonomous Systems",
      metrics: [
        { label: "Datasets", value: "KITTI & Waymo Multi-Modal Benchmarks" },
        { label: "Edge Target", value: "NVIDIA Jetson Nano Deployment" }
      ],
      architecture: {
        pipeline: ["KITTI / Waymo Point Clouds + RGB", "Extrinsic Calibration & Frustum Projection", "Camera-LiDAR Feature Fusion", "Jetson Nano Edge Runtime"],
        problem: "3D LiDAR point clouds are geometrically accurate but sparse at range, whereas RGB cameras provide dense semantics without reliable depth.",
        tradeoff: "Aligned 3D LiDAR frustums with 2D camera feature planes and configured an embedded inference stack on NVIDIA Jetson Nano to balance accuracy with edge power constraints.",
        highlights: [
          "Large-scale data ingestion and coordinate calibration on KITTI and Waymo Open Dataset.",
          "Hands-on embedded Linux and GPU bring-up on NVIDIA Jetson Nano."
        ]
      }
    },
    {
      title: "Coordination of Automated Vehicles at Roundabouts",
      description: "• Conducted competitive and scenario analysis to evaluate various mobility strategies.\n• Contributed to roadmap recommendations for advanced traffic systems.\n• Utilized SUMO and Simulink for traffic flow simulation.",
      technologies: ["SUMO", "Simulink", "Python", "Scenario Analysis"],
      visualComponent: 'Roundabout',
      githubUrl: "https://github.com/Ashwin-AIAS/intelligent-transportation-systems",
      liveUrl: "#",
      category: "Autonomous Systems",
      metrics: [
        { label: "Simulators", value: "Eclipse SUMO + MATLAB Simulink" },
        { label: "Objective", value: "V2X Roundabout Throughput & Safety" }
      ],
      architecture: {
        pipeline: ["Traffic Demand Profiles", "SUMO Microscopic Road Network", "Simulink Longitudinal/Lateral Control", "Cooperative Merge Policy", "Throughput & Wait-Time KPIs"],
        problem: "Uncoordinated autonomous and human-driven vehicles at multi-lane roundabouts create stop-and-go shockwaves and deadlocks.",
        tradeoff: "Co-simulated microscopic traffic flow in SUMO with vehicle dynamics in Simulink to benchmark cooperative gap-acceptance policies against baseline human traffic.",
        highlights: [
          "Quantitative scenario evaluation across varying CAV penetration rates.",
          "Actionable V2X infrastructure roadmap for intelligent transportation systems."
        ]
      }
    },
    {
      title: "Custom RL Environment: 'Road to Mr. Olympia 2024'",
      description: "• Developed AI agents using reinforcement learning (Q-Learning, PPO).\n• Simulated complex, multi-stage decision-making in a custom Python environment.\n• Focused on optimizing long-term rewards.",
      technologies: ["Python", "Reinforcement Learning", "Q-Learning", "PPO"],
      visualComponent: 'ReinforcementLearning',
      githubUrl: "https://github.com/Ashwin-AIAS/Custom-Python-Environment-for-Autonomous-Systems-called-Road-to-Mr.Olympia-2024-",
      liveUrl: "#",
      category: "Autonomous Systems",
      metrics: [
        { label: "Algorithms", value: "Tabular Q-Learning vs. Deep PPO" },
        { label: "Environment", value: "Custom OpenAI Gym-Style State Space" }
      ],
      architecture: {
        pipeline: ["Custom MDP State Space", "Reward Shaping Engine", "Tabular Q-Learning Baseline", "Proximal Policy Optimization (PPO)", "Policy Convergence Telemetry"],
        problem: "Delayed sparse rewards in multi-stage sequential planning cause naive RL agents to overfit to short-term gains or fail to converge.",
        tradeoff: "Designed a shaped reward curriculum and benchmarked value-based Q-Learning against actor-critic PPO to stabilize long-horizon policy convergence.",
        highlights: [
          "Custom Gymnasium-compatible environment built from scratch in Python.",
          "Comparative ablation between discrete value iteration and clipped policy gradients."
        ]
      }
    },
    {
      title: "N8N Webhook Forwarder",
      description: "• Built a webhook forwarding system using N8N workflow automation.\n• Configured automated data pipelines triggered by external webhook events.\n• Streamlined integration between services with event-driven architecture.",
      technologies: ["N8N", "Webhooks", "Automation", "API Integration"],
      visualComponent: 'Webhook',
      githubUrl: "https://github.com/Ashwin-AIAS/N8N",
      liveUrl: "#",
      category: "Edge C++ & Tools",
      metrics: [
        { label: "Architecture", value: "Event-Driven Webhook Relay" },
        { label: "Orchestration", value: "Automated N8N Pipelines" }
      ]
    },
    {
      title: "Interactive Portfolio with AI Assistant",
      description: "• Built a React-based interactive portfolio utilizing Framer Motion for advanced animations.\n• Upgraded AI recruiter assistant with Gemini Embedding 2 multimodal embeddings for semantic cross-modal match scoring.\n• Implemented an animated avatar tour guide and scroll-based interactions.",
      technologies: ["React", "Framer Motion", "Gemini API", "Tailwind CSS"],
      visualComponent: 'PortfolioAI',
      githubUrl: "https://github.com/Ashwin-AIAS/react-portfolio",
      liveUrl: "#",
      category: "GenAI & RAG",
      metrics: [
        { label: "AI Engine", value: "Gemini 2.5 Live Voice + Text JD Fit Analyzer" },
        { label: "In-Browser Labs", value: "Int8 CNN Quantization + 30Hz Kalman Fusion" }
      ]
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
