# GeoSmart AI: Crisis Management & Volunteer Allocation

GeoSmart AI is a MERN-based platform designed for NGOs to visualize crisis zones and automate volunteer coordination using AI and geospatial analytics.

## 🚀 Features
- **Crisis Heatmap**: Interactive map visualizing urgent needs (built with Leaflet + Dark Theme).
- **AI Field Input**: WhatsApp-style simulation powered by **Google Gemini** to parse unstructured reports.
- **Priority Scoring**: Real-time calculation of crisis urgency based on impact.
- **Smart Matching**: Automated volunteer-to-task matching using Haversine distance and skill scores.
- **Premium Dashboard**: High-fidelity dark mode UI with smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons, Leaflet.js.
- **Backend**: Node.js, Express.js, MongoDB Atlas.
- **AI**: Google Gemini API.

## 🏃 How to Run

### 1. Prerequisite
Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### 2. Start Backend
```bash
cd server
npm install
node index.js
```

### 3. Start Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Seed Demo Data
```bash
cd server
node seed.js
```

---
Built for **Solution Challenge 2026**
