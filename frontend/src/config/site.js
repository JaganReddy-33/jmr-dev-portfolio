export const SITE = {
  name: 'Ragipalyam Jaganmohan Reddy',
  email: 'ragipalyamjaganmohanreddy@gmail.com',
  phone: '+91 95155 07061',
  phoneHref: '+919515507061',
  location: 'Bengaluru · open to relocate anywhere in India',
  github: 'https://github.com/JaganReddy-33',
  linkedin: 'https://www.linkedin.com/in/jaganmohanreddy33/',
};

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

// Update your resume in Google Drive (same file, new version) and the site stays current.
const RESUME_ID = import.meta.env.VITE_RESUME_FILE_ID || '1y55pg_7yA0cXcHitDf5LlExKdCSo5QVh';
export const RESUME = {
  view: `https://drive.google.com/file/d/${RESUME_ID}/view`,
  preview: `https://drive.google.com/file/d/${RESUME_ID}/preview`,
  download: `https://drive.google.com/uc?export=download&id=${RESUME_ID}`,
};
