# Cortex Sense

**A neuroadaptive learning prototype that adapts web content to your cognitive state in real-time.**

Cortex Sense is an open-source project that explores a new paradigm in user-centric web experiences. It demonstrates a complete feedback loop where a user's cognitive state, derived from a simulated brain-computer interface (BCI), directly influences the content they see. This project serves as a proof-of-concept for creating truly personalized and adaptive applications.

### Key Features

* **Live EEG Simulation:** An interactive, in-browser simulator generates distinct brainwave patterns for different cognitive states ("Focused" and "Drowsy"), allowing for full functionality without physical hardware.
* **AI-Powered State Classification:** A lightweight, client-side neural network built with **Brain.js** is trained in real-time to classify the live EEG data stream.
* **Adaptive Text Intervention:** The application's core feature. When the AI detects a "Drowsy" state, the learning content is automatically simplified to help the user maintain engagement and focus.
* **Privacy-First Architecture:** All data simulation, AI model training, and real-time classification happen exclusively on the client-side. No personal or neural data is ever transmitted or stored externally.

### ⚙️ Technology Stack

* **AI / Machine Learning:** [Brain.js](https://github.com/BrainJS/brain.js)
* **Data Visualization:** [Chart.js](https://www.chartjs.org/)
* **Frontend:** HTML, CSS, JavaScript (ES6+)
* **Foundation:** Built on the [PWA Starter](https://github.com/pwa-builder/pwa-starter) for a modern, reliable web application base.

### 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your machine.

#### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/shahirun-x/CortexSense.git](https://github.com/shahirun-x/CortexSense.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd CortexSense
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm start
    ```
    Your browser should automatically open to `http://localhost:3000`.

### Usage Workflow

To see the neuroadaptive intervention in action, follow these steps in the application:

1.  **Train the AI:** Click the **`Train AI`** button. Wait a few seconds for the "Cognitive State" status to change to "AI Ready". The training progress will be logged in your browser's developer console.
2.  **Start the Simulator:** Click **`Start Simulator`** to begin the live EEG data stream.
3.  **Generate Focused Data:** Click **`Generate Focused Data`**. The AI will predict your state as "Focused", and the original, detailed text will be displayed.
4.  **Generate Drowsy Data:** Click **`Generate Drowsy Data`**. The AI will predict your state as "Drowsy", and the paragraph will instantly change to a simpler, summarized version.

### Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### License

Distributed under the MIT License. See `LICENSE.txt` for more information.
