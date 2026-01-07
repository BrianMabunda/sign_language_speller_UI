Live Demo on Vercel | Backend API on Hugging Face
This project is a real-time Sign Language Alphabet Classifier that bridges Computer Vision and Machine Learning. Using a React-based frontend and a FastAPI backend, it captures hand landmarks through a webcam and predicts American Sign Language (ASL) letters with high accuracy.

🚀 How It Works
Hand Tracking: The frontend uses Google MediaPipe to detect 21 3D hand landmarks in real-time.

Data Transmission: These landmarks are normalized and sent as a JSON payload to a remote FastAPI server.

Inference: The backend server runs a Random Forest Classifier (trained on 20,000+ samples) to predict the letter.

Feedback: The prediction is returned to the UI and displayed instantly to the user.

🛠️ Tech Stack
Frontend (This Repo)
Framework: React.js

Computer Vision: MediaPipe Hands

Deployment: Vercel

Backend (View Backend Repo)
Language: Python 3.10

API: FastAPI

Machine Learning: Scikit-Learn (Random Forest)

Containerization: Docker

Hosting: Hugging Face Spaces

📦 Local Setup
Clone the repository:

Bash

git clone https://github.com/your-username/alphabet-classifier-ui.git
cd alphabet-classifier-ui
Install dependencies:

Bash

npm install
Configure Environment Variables: Create a .env file in the root directory:

Code snippet

REACT_APP_API_URL=https://brianmabunda00-alphabet-classifier.hf.space/predict
Run the application:

Bash

npm start
🧠 Model Information
The model was trained by extracting hand landmarks from a diverse dataset of ASL signs. By using landmarks rather than raw pixel data, the system is:

Privacy-Friendly: We don't store or process actual video/images on the server.

Lighting Independent: The model focuses on the geometry of the hand, not the background.

Fast: The JSON payload is tiny (~2KB), allowing for near-instant predictions even on mobile data.

🚧 Challenges Faced
LFS Integration: Managing large .p model files using Git LFS for seamless deployment.

Cross-Origin Requests: Configuring CORS on the FastAPI backend to allow the Vercel frontend to communicate securely.

Cold Starts: Implementing UI logic to handle the initial wake-up time of the Hugging Face Free Tier.

🤝 Contact
Developed by Brian Mabunda LinkedIn Profile | Portfolio