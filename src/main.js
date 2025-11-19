import './style.css'; // Import the Cyberpunk Theme
// --- 1. IMPORT THE AI LIBRARY ---
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chart, registerables } from 'chart.js';

// Register Chart.js components (needed for module imports)
Chart.register(...registerables);

// --- 2. SETUP THE AI MODEL ---
// We access the key from the .env file we made earlier
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const simulatorStatusEl = document.getElementById('simulator-status');
    const cognitiveStateEl = document.getElementById('cognitive-state');
    const contentParagraphEl = document.getElementById('content-paragraph');
    const startBtn = document.getElementById('start-sim-btn');
    const stopBtn = document.getElementById('stop-sim-btn');
    const generateFocusedBtn = document.getElementById('generate-focused-btn');
    const generateDrowsyBtn = document.getElementById('generate-drowsy-btn');
    const trainAIBtn = document.getElementById('train-ai-btn');
    const ctx = document.getElementById('eeg-chart').getContext('2d');

    // Store the original complex text so we can switch back
    const originalText = contentParagraphEl.textContent;

    // Variable to store the AI generated simple text
    let aiGeneratedSimpleText = "";
    let isGeneratingContent = false; // Flag to prevent spamming the API

    let simulationInterval;
    let currentState = 'normal';
    let isTrained = false;

   // --- CHART SETUP (UPDATED FOR KAWAII THEME) ---
    // Set font color to cute dark purple
    Chart.defaults.color = '#6b4c5e';
    Chart.defaults.font.family = "'Quicksand', sans-serif";
    Chart.defaults.borderColor = 'rgba(255, 182, 193, 0.4)';

    const chartData = {
        labels: Array(50).fill(''),
        datasets: [{
            label: 'Brain Sparkles ✨',
            data: Array(50).fill(0),
            borderColor: '#ff69b4', // Hot Pink Line
            backgroundColor: 'rgba(255, 182, 193, 0.4)', // Soft pink fill
            borderWidth: 4, // Thicker, cuter line
            fill: true,
            tension: 0.5, // Very round and smooth
            pointRadius: 0,
            pointHoverRadius: 10
        }]
    };

    const eegChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: -100,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 105, 180, 0.1)', // Pink grid lines
                        borderDash: [5, 5] // Dashed grid lines (cute)
                    },
                    ticks: { display: false } // Hide numbers for cleaner look
                },
                x: {
                    grid: { display: false }
                }
            },
            animation: { duration: 0 },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // --- SIMULATOR LOGIC ---
    function getMockEEGData(state) {
        const timestamp = Date.now() / 1000;
        if (state === 'focused') {
            return Math.sin(timestamp * 20) * 25 + (Math.random() - 0.5) * 15;
        } else if (state === 'drowsy') {
            return Math.sin(timestamp * 3) * 60 + (Math.random() - 0.5) * 10;
        } else {
            return Math.sin(timestamp * 5) * 50 + (Math.random() - 0.5) * 10;
        }
    }

    function updateChart() {
        chartData.datasets[0].data.shift();
        chartData.datasets[0].data.push(getMockEEGData(currentState));
        eegChart.update();

        if (isTrained) {
            runPrediction();
        }
    }

    // --- NEW: GEN-AI CONTENT FUNCTION ---
    async function generateSimplifiedContent() {
        if (isGeneratingContent || aiGeneratedSimpleText !== "") return; // Don't run if busy or already done

        isGeneratingContent = true;
        contentParagraphEl.style.opacity = "0.5"; // Fade text to show loading

        try {
            console.log("Asking Gemini to simplify text...");
            // This is the Prompt Engineering part
            const prompt = `You are a witty tutor. The student is falling asleep.
            Rewrite the following text to be extremely simple, funny, and very short (1 sentence).
            Here is the text: "${originalText}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiGeneratedSimpleText = response.text();

            // Update the UI with the new AI text
            if (currentState === 'drowsy') {
                contentParagraphEl.textContent = aiGeneratedSimpleText;
                contentParagraphEl.style.color = '#d63384'; // Change to specialized color
            }
            console.log("Gemini responded:", aiGeneratedSimpleText);

        } catch (error) {
            console.error("AI Error:", error);
            contentParagraphEl.textContent = "Oof, even the AI is tired. (Error connecting)";
        } finally {
            isGeneratingContent = false;
            contentParagraphEl.style.opacity = "1";
        }
    }

    // --- PREDICTION & INTERVENTION LOGIC ---
    function runPrediction() {
        const currentSample = chartData.datasets[0].data.slice(-5);
        const predictedState = brain.likely(currentSample, net);
        const displayState = predictedState.charAt(0).toUpperCase() + predictedState.slice(1);

        cognitiveStateEl.textContent = displayState;

        // --- THE ADAPTIVE TRIGGER ---
        if (predictedState === 'drowsy') {
            // 1. VISUAL: Generate/Show Simple Text
            if (aiGeneratedSimpleText === "") {
                generateSimplifiedContent();
            } else if (contentParagraphEl.textContent !== aiGeneratedSimpleText) {
                contentParagraphEl.textContent = aiGeneratedSimpleText;
                contentParagraphEl.style.color = '#d9066fff';
            }

            // 2. AUDIO: Stop focus music, Play Alert
            stopBinauralBeat();
            // We use a random chance so it doesn't beep 20 times a second
            if (Math.random() > 0.95) playWakeUpAlert();

        } else {
            // State is FOCUSED
            // 1. VISUAL: Show Original Text
            if (contentParagraphEl.textContent !== originalText) {
                contentParagraphEl.textContent = originalText;
                contentParagraphEl.style.color = 'inherit';
            }

            // 2. AUDIO: Play Focus Music
            // (User must interact with page first for audio to work due to browser rules)
            playBinauralBeat();
        }
    }

    // --- CONTROL FUNCTIONS ---
    function startSimulation() {
        if (simulationInterval) return;
        simulationInterval = setInterval(updateChart, 50);
        simulatorStatusEl.textContent = 'CONNECTED';
        simulatorStatusEl.style.color = '#28a745';
    }

    function stopSimulation() {
        clearInterval(simulationInterval);
        simulationInterval = null;
        currentState = 'normal';
        simulatorStatusEl.textContent = 'DISCONNECTED';
        simulatorStatusEl.style.color = '#ff6347';
        contentParagraphEl.textContent = originalText;
        contentParagraphEl.style.color = 'inherit';
    }

    startBtn.addEventListener('click', () => {
    audioCtx.resume(); // Wake up the audio engine
    startSimulation();
});
    stopBtn.addEventListener('click', stopSimulation);

    // Reset AI text when switching states manually so we can see it generate again
    generateFocusedBtn.addEventListener('click', () => { currentState = 'focused'; });
    generateDrowsyBtn.addEventListener('click', () => {
        currentState = 'drowsy';
    });

    // --- AI TRAINING LOGIC (Unchanged) ---
    const net = new brain.NeuralNetwork({ hiddenLayers: [4] });

    function trainModel() {
        console.log("Starting AI training...");
        cognitiveStateEl.textContent = "Training...";
        isTrained = false;

        const trainingData = [];
        const sampleSize = 5;
        const numSamples = 100;

        // Generate Focused Samples
        for (let i = 0; i < numSamples; i++) {
            const sample = [];
            for (let j = 0; j < sampleSize; j++) {
                sample.push(getMockEEGData('focused'));
            }
            trainingData.push({ input: sample, output: { focused: 1 } });
        }

        // Generate Drowsy Samples
        for (let i = 0; i < numSamples; i++) {
            const sample = [];
            for (let j = 0; j < sampleSize; j++) {
                sample.push(getMockEEGData('drowsy'));
            }
            trainingData.push({ input: sample, output: { drowsy: 1 } });
        }

        net.train(trainingData, {
            iterations: 500,
            log: true,
            logPeriod: 50,
        });

        isTrained = true;
        console.log("AI training complete!");
        cognitiveStateEl.textContent = "AI Ready";
    }

    trainAIBtn.addEventListener('click', trainModel);
});
// --- AUDIO SYSTEM (Binaural Beats & Alerts) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let binauralOscillators = [];
let isBinauralPlaying = false;

function playBinauralBeat() {
    if (isBinauralPlaying) return; // Don't start if already playing

    // Create two oscillators for the "Focused" 40Hz effect
    // Left Ear: 200Hz | Right Ear: 240Hz -> Difference = 40Hz (Gamma Wave)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const pan1 = audioCtx.createStereoPanner();
    const pan2 = audioCtx.createStereoPanner();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.value = 200;
    osc2.frequency.value = 240;

    // Pan them to opposite ears
    pan1.pan.value = -1; // Left
    pan2.pan.value = 1;  // Right

    // Lower volume so it's subtle background focus music
    gainNode.gain.value = 0.1;

    // Connect the wires
    osc1.connect(pan1).connect(gainNode).connect(audioCtx.destination);
    osc2.connect(pan2).connect(gainNode).connect(audioCtx.destination);

    osc1.start();
    osc2.start();

    binauralOscillators = [osc1, osc2];
    isBinauralPlaying = true;
    console.log("Audio: Playing 40Hz Gamma Binaural Beat (Focus)");
}

function stopBinauralBeat() {
    if (!isBinauralPlaying) return;

    binauralOscillators.forEach(osc => osc.stop());
    binauralOscillators = [];
    isBinauralPlaying = false;
    console.log("Audio: Stopping Focus Sound");
}

function playWakeUpAlert() {
    // A sharp, annoying beep to wake you up
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth'; // Harsh sound
    osc.frequency.value = 800; // High pitch

    // Fade out quickly (like a "ping")
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
    console.log("Audio: WAKE UP ALERT!");
}