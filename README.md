# 🌾 Project Kisan Mitra — AI Agent for Indian Farmers

> Multilingual, multimodal AI assistant helping Indian farmers with disease diagnosis, mandi trends, and government schemes — via voice or image in their native language.

---

## 👥 Team Details

- **Team Name:** Team 5 
- **Team Lead:** Keshav Garg 
- **Problem Statement:**  
  > Providing farmers with expert help on demand, especially for crop disease diagnosis, market trends, and government schemes — all in native languages.

---

## 💡 Project Idea

Kisan Mitra empowers farmers with on-demand assistance using modern AI tools like Google Gemini and Vertex AI. It handles:

- ✅ **Plant disease diagnosis** from voice or image
- ✅ **Live mandi price trends** + insights
- ✅ **Government scheme discovery and application**
- ✅ **Weather, soil, and agri news alerts**

---

## 🔍 Why Kisan Mitra?

| Problem | How We Solve |
|--------|--------------|
| Raw data isn't actionable | ✅ We provide summaries, graphs, voice output |
| Language barriers | ✅ Voice-first, multilingual UI |
| Scattered sources | ✅ Unified decision dashboard |

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| 🎙️ Voice Chat | Gemini-powered live chat in native language |
| 🌿 Crop Disease Diagnosis | From voice or image uploads |
| 📈 Mandi Prices | Real-time + historical trends |
| 🧾 Scheme Discovery | Government subsidy finder with summaries |
| 📍 Market Comparisons | Cross-district/state pricing |
| 🗓️ Crop Calendar | Contextual sowing & harvesting suggestions |
| 📰 Region Alerts | Soil/weather/news updates |
| 🧪 Soil Quality *(Planned)* | pH and nutrient analysis assistant |

---

## 🔁 User Flow

```text
📤 Upload Crop Image + Ask Question in Native Language
↓
🧠 Gemini processes audio + image
↓
🦠 Diagnoses disease OR
📊 Shows pricing insights OR
💰 Summarizes schemes
↓
🗣️ Returns voice + text output with charts
```



## 🧑‍💻 Project Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-org/kisan-mitra.git
cd kisan-mitra
```
### 2️⃣ Install Dependencies
```bash
pnpm install    # or npm install / yarn install
```
### 3️⃣ Set Up Environment Variables
Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```
#### .env.example:
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_GENERATIVE_API_KEY=
NEXT_PUBLIC_MANDI_API_KEY=
NEXT_PUBLIC_HISTORICAL_MANDI_API_URL=
NEXT_PUBLIC_TODAY_MANDI_API_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

### 4️⃣ Start Development Server
```bash
pnpm dev    # or npm run dev / yarn dev
```
Visit http://localhost:3000

## 🧱 Tech Stack
```text
Tech	Purpose
Next.js 15	App framework
Tailwind CSS + ShadCN	UI components
Google Gemini + Vertex AI	Multimodal + language AI
TTS / STT	Voice interaction
Clerk	Authentication
Recharts / Chart.js	Visualizations
Mandi + Scheme APIs	Data sources
Edge functions	Secure API routing
```

## 🧩 Folder Structure
```bash
/app            # App router pages and layout
/components     # Reusable UI components
/lib            # Helper functions (API, charts, TTS)
/public         # Static assets
/styles         # Global styles
/env.example    # Environment variable template
```

## 🧪 Planned Enhancements
```text
 Soil quality analysis from sensor/API
 Location Context
 Weather Context
```
## 📜 License
This project is licensed under the MIT License.

## 📬 Contact
Project Lead: Harsh Wardhan

Github:-[https://github.com/harshwardhan847/kisan-mitra-Triwizardathon](https://github.com/harshwardhan847/kisan-mitra-Triwizardathon)

Live link:-[https://kisan-mitra-triwizardathon.vercel.app/](https://kisan-mitra-triwizardathon.vercel.app/)

```
Built with ❤️ by Aura Grow Team for empowering Indian farmers with AI.
```
