import React from 'react';

export const SkillBadge = ({ skillName }) => {
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
