import React from 'react';
import { motion } from 'framer-motion';

const skillConfig = {
  Python:                   { icon: 'python',                   color: '#4B9CD3', bg: 'rgba(75,156,211,0.12)'  },
  'C/C++':                  { icon: 'cplusplus',                color: '#6CB4E4', bg: 'rgba(0,89,156,0.15)'   },
  SQL:                      { icon: 'postgresql',               color: '#6B9FD4', bg: 'rgba(68,121,161,0.15)' },
  FastAPI:                  { icon: 'fastapi',                  color: '#00BFA5', bg: 'rgba(0,150,136,0.15)'  },
  Docker:                   { icon: 'docker',                   color: '#2496ED', bg: 'rgba(36,150,237,0.15)' },
  CMake:                    { icon: 'cmake',                    color: '#6BAED6', bg: 'rgba(6,79,140,0.18)'   },
  'Power Automate':         { icon: 'microsoftpowerautomate',   color: '#5B9BD5', bg: 'rgba(0,102,255,0.15)'  },
  Simulink:                 { icon: null,                       color: '#E05C4B', bg: 'rgba(217,35,15,0.15)'  },
  SUMO:                     { icon: null,                       color: '#8BC34A', bg: 'rgba(118,185,0,0.15)'  },
  Pandas:                   { icon: 'pandas',                   color: '#9B8FE8', bg: 'rgba(130,100,220,0.15)'},
  NumPy:                    { icon: 'numpy',                    color: '#4DABCF', bg: 'rgba(77,171,207,0.15)' },
  PyTorch:                  { icon: 'pytorch',                  color: '#EE6C4D', bg: 'rgba(238,76,44,0.15)'  },
  Keras:                    { icon: 'keras',                    color: '#E05252', bg: 'rgba(208,0,0,0.15)'    },
  TensorFlow:               { icon: 'tensorflow',               color: '#FF8F00', bg: 'rgba(255,111,0,0.15)'  },
  OpenCV:                   { icon: 'opencv',                   color: '#7B68EE', bg: 'rgba(92,62,232,0.15)'  },
  YOLOv8:                   { icon: null,                       color: '#00E5FF', bg: 'rgba(0,229,255,0.10)'  },
  MediaPipe:                { icon: 'google',                   color: '#26C6DA', bg: 'rgba(0,151,167,0.15)'  },
  GANs:                     { icon: null,                       color: '#FFA040', bg: 'rgba(255,111,0,0.15)'  },
  LangChain:                { icon: 'langchain',                color: '#4CAF82', bg: 'rgba(28,124,60,0.15)'  },
  'Gemini API':             { icon: 'googlegemini',             color: '#A78BFA', bg: 'rgba(142,117,178,0.15)'},
  'Reinforcement Learning': { icon: null,                       color: '#FFB74D', bg: 'rgba(255,193,7,0.15)'  },
  'Prompt Engineering':     { icon: null,                       color: '#CE93D8', bg: 'rgba(156,39,176,0.15)' },
  React:                    { icon: 'react',                    color: '#61DAFB', bg: 'rgba(97,218,251,0.10)'  },
  PostgreSQL:               { icon: 'postgresql',               color: '#5B8DD9', bg: 'rgba(65,105,225,0.15)' },
  pgvector:                 { icon: 'postgresql',               color: '#7099C8', bg: 'rgba(51,103,145,0.15)' },
  Streamlit:                { icon: 'streamlit',                color: '#FF6B6B', bg: 'rgba(255,75,75,0.15)'  },
  'Power BI':               { icon: 'microsoftpowerbi',         color: '#F2C811', bg: 'rgba(242,200,17,0.15)' },
  Excel:                    { icon: 'microsoftexcel',           color: '#33A75A', bg: 'rgba(33,115,70,0.15)'  },
  Tableau:                  { icon: 'tableau',                  color: '#E97627', bg: 'rgba(233,118,39,0.15)' },
  SharePoint:               { icon: 'microsoftsharepoint',      color: '#2B88D8', bg: 'rgba(0,120,212,0.15)'  },
  Confluence:               { icon: 'confluence',               color: '#4B79D0', bg: 'rgba(0,82,204,0.18)'   },
  Jira:                     { icon: 'jira',                     color: '#2684FF', bg: 'rgba(0,82,204,0.15)'   },
  GitHub:                   { icon: 'github',                   color: '#E0E0E0', bg: 'rgba(255,255,255,0.08)'},
  N8N:                      { icon: 'n8n',                      color: '#EA4B71', bg: 'rgba(234,75,113,0.15)' },
};

export const SkillBadge = ({ skillName, index = 0 }) => {
  const cfg = skillConfig[skillName] || { color: '#888', bg: 'rgba(136,136,136,0.12)', icon: null };
  
  const x = motion.useMotionValue(0);
  const y = motion.useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3); // Magnetic pull strength
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        background: cfg.bg,
        border: `1px solid ${cfg.color}35`,
        color: cfg.color,
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide cursor-default select-none shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {cfg.icon && (
        <img
          src={`https://cdn.simpleicons.org/${cfg.icon}/${cfg.color.replace('#', '')}`}
          alt=""
          className="w-3.5 h-3.5 flex-shrink-0 pointer-events-none"
          loading="lazy"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <span className="pointer-events-none">{skillName}</span>
    </motion.div>
  );
};
