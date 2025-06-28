# 🌍 EcoCommute: Smarter, Greener Commute Planning with AI

**EcoCommute** is an AI-powered web app designed to help users plan more sustainable and efficient commutes. By integrating real-time traffic, environmental impact analysis, and intelligent recommendations, users receive optimized routes tailored for cost, CO₂ emissions, and time. 

Built with a combination of **React**, **Tailwind CSS**, and a **FastAPI** backend, EcoCommute aims to gamify and simplify the journey toward eco-friendly transportation.

---

## What It Does

- **Route Optimization**: Plan commutes using live traffic data and receive recommended transportation modes (walk, bike, bus, car, etc.).
- **CO₂ Impact Calculation**: Calculate and visualize emissions and savings based on mode and distance.
-  **Cleanest Route Suggestion**: Look up the cleanest route you've taken previously between two locations.
- **AI Explanation Generator**: Uses Gemini (Google's LLM) to explain *why* a particular route/mode was chosen in natural language.
- **Weekly Commute Simulation**: Visualize your weekly CO₂ impact compared to the average commuter.
- **Interactive Map Input**: Click to select your start and destination on a live Leaflet map.
- **Badges and Rewards**: Earn badges based on eco-friendly commute behavior.

---

## 👩‍💻 Authors

### Toya Okey-Nwamara
- 🎓 Senior in Computer Science, UNC Charlotte  
- 🔐 Cybersecurity & Consulting enthusiast  
- 🎮 Rainbow Six Siege playe :)   
- 🧠 CodePath Student (Technical Interview Prep, Cybersecurity, Web Development, and etc)   
- 💼 Incoming Intern at Protiviti (Technology Consulting)  
- Led with frontend development using React.js and Tailwind CSS 

### Gracie Deese
- 🎓 Freshman in Computer Science, UNC Charlotte  
- 🔐 Cybersecurity Enthusiast  
- 🧪 Led backend development with FastAPI and SQLite  

---

## 🤖 How We Used AI

EcoCommute integrates **multiple forms of AI**:

- **Gemini 2.0 (Flash)**: To generate natural language explanations for why a specific commute route or mode is optimal.
- **Time Series Modeling** *(Optional Extension)*: To simulate predicted CO₂ emissions over time based on user patterns.
- **Generative Feedback**: Users are given reflective feedback to encourage greener commute choices.

---

## ⚙️ Requirements

### Install Dependencies

You must have the following installed:

- **Node.js** (for frontend)
- **Python 3.9+** (for backend with FastAPI)
- **npm** (for frontend dependencies)
- **pip** (for Python dependencies)

---

## 🔧 Getting Started

### 1. 📦 Install Frontend (React)

```bash
cd frontend/eco-commute-frontend
npm install # or npm i 
npm run dev
```

> Make sure you're in the frontend directory when running dev server.

---

### 2. 🐍 Setup Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 3. 🔐 Required API Keys

You'll need to create a `config.py` file in the backend directory to store your API keys securely.

Create the file with the following content:

```python
# config.py
GEMINI_API = "your-gemini-api-key"
GOOGLE_MAPS_API = "your-google-api-key"
```

Make sure not to commit this file to version control (e.g., GitHub) by adding `config.py` to your `.gitignore` file.


You’ll need two API keys saved as environment variables or config file:

- **Google Maps API Key** (for traffic + distance)
- **Gemini API Key** (for explanation generation via Gemini Flash 2.0)

In your `config.py` or `.env`, include:

```python
# config.py
GEMINI_API = "your-gemini-api-key"
GOOGLE_MAPS_API = "your-google-api-key"
```

---

## 📁 Project Structure

```
EcoCommute/
├── frontend/
│   └── React, Tailwind, MapSelector, CommuteForm, Impact, Simulation, etc.
├── backend/
│   └── main.py, utils.py, config.py
├── requirements.txt
└── README.md
```

---

## 🚀 Features Coming Soon

- 📍 Location-based badge achievements
- 🔒 User authentication
- 📊 Leaderboards for eco impact
- 🌐 Social route sharing

---

## 🗺️ Future Plans & Features

We’re just getting started with EcoCommute here's what we plan to do: 

- **Mobile App Version**  
  A future mobile-friendly version of EcoCommute to allow on-the-go route planning and emissions tracking.

- **Comparison View for Cost Evaluation**  
  Introduce a comparison tool to let users visually compare different modes by time, CO₂ emissions, and **cost** to make informed decisions.

- **Advanced Time Series Forecasting**  
  Visualize **daily carbon emissions** trends using time series models and compare them over weeks to help users track their long-term eco-impact.

- **Best Route Over Time**  
  Aggregate user trip history to **suggest the most efficient route** over time based on recurring behavior, time of day, and traffic patterns.

- **Smarter Simulation Module**  
  Upgrade the simulation tool to show not just emissions, but also **alternative routes and modes side-by-side** with estimated benefits.

- **User History Dashboard**  
  A detailed view of **past commutes**, CO₂ saved over time, and improvement suggestions using AI.

- **User Authentication**  
  Let users **log in** and track their data across sessions, devices, and share progress with friends.

- **Eco Leaderboard & Achievements**  
  Compete with friends or the community for **badges and rankings** based on eco-conscious behavior.

---

## 📬 Contact

Have questions or want to contribute?

- Emails: tokeynwa@charlotte.ede, cdeese8@charlotte.edu 
- GitHub: [github.com/ToyaOkey](https://github.com/ToyaOkey)

---


