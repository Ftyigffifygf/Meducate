# Meducate

An AI-powered medical education chatbot built with React + TypeScript + Vite.
The app allows users to select a medical specialty (MBBS, Ayurveda, Yoga, etc.) and chat with an AI assistant that provides expert-level answers tailored to the chosen field.

🚀 Features

Specialty Selection – Choose between multiple medical domains (MBBS, Ayurveda, Yoga, etc.).

AI-Powered Chat – Ask medical/educational questions and receive AI-driven answers.

Streaming Responses – Model answers stream in real-time for better UX.

Markdown Rendering – Supports GitHub-flavored markdown with code syntax highlighting.

Image Input Support – Upload an image (e.g., X-ray, MRI, diagrams) with your query.

Dark Mode Support – Auto-adjusts between light/dark themes.

Modern UI – Built with Tailwind CSS for a clean, responsive interface.

🛠️ Tech Stack

Frontend Framework: React 19
 + TypeScript

Bundler: Vite

Styling: Tailwind CSS

AI Integration: @google/genai
 (Gemini API)

Markdown Rendering: react-markdown
 + remark-gfm

Code Highlighting: react-syntax-highlighter

📦 Installation

Clone the repo and install dependencies:

git clone https://github.com/Ftyigffifygf/Meducate
cd meducate-ai
npm install

▶️ Running the App

Start the development server:

npm run dev


Build for production:

npm run build


Preview production build:

npm run preview

📂 Project Structure
meducate-ai/
│── index.html          # Entry HTML with Tailwind + Import Maps
│── vite.config.ts      # Vite configuration
│── tsconfig.json       # TypeScript configuration
│── package.json        # Dependencies & scripts
│── App.tsx             # Main app with chat logic
│── index.tsx           # React entry point
│── constants.ts        # Specialty constants
│── types.ts            # TypeScript types (Specialty, ChatMessage, etc.)
│── services/           # AI integration (Gemini service)
│── components/         # UI components (Header, ChatInterface, etc.)
│── .gitignore          # Ignored files

⚡ Usage

Select a specialty (e.g., MBBS, Ayurveda, siddha, Homeopathy, Yoga&Naturopathy).

Type your question or upload an image.

Get an expert AI response in real time.

🔮 Roadmap

 Add more specialties (e.g., Dentistry, Nursing).

 Multi-language support.

 Save & export chat history.

 User authentication for personalized sessions.

📜 License

This project is licensed under the Apache2.0 License.
