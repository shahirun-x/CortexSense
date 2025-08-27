document.addEventListener('DOMContentLoaded', () => {
    // Get references to all our HTML elements
    const simulatorStatusEl = document.getElementById('simulator-status');
    const cognitiveStateEl = document.getElementById('cognitive-state');
    const contentParagraphEl = document.getElementById('content-paragraph');
    const startBtn = document.getElementById('start-sim-btn');
    const stopBtn = document.getElementById('stop-sim-btn');
    const generateFocusedBtn = document.getElementById('generate-focused-btn');
    const generateDrowsyBtn = document.getElementById('generate-drowsy-btn');
    const trainAIBtn = document.getElementById('train-ai-btn');
    const ctx = document.getElementById('eeg-chart').getContext('2d');

    // Store the original and a simple version of the learning text
    const originalText = contentParagraphEl.textContent;
    const simpleText = "Quantum computers use special physics, like superposition and entanglement, to solve very hard problems much faster than normal computers.";

    let simulationInterval;
    let currentState = 'normal';

    // Setup for the chart
    const chartData = {
        labels: Array(50).fill(''),
        datasets: [{
            label: 'Simulated EEG',
            data: Array(50).fill(0),
            borderColor: '#007bff',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
        }]
    };

    const eegChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: { y: { min: -100, max: 100 } },
            animation: { duration: 0 }
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

    // --- PREDICTION & INTERVENTION LOGIC ---
    function runPrediction() {
        const currentSample = chartData.datasets[0].data.slice(-5);
        const predictedState = brain.likely(currentSample, net);
        const displayState = predictedState.charAt(0).toUpperCase() + predictedState.slice(1);
        cognitiveStateEl.textContent = displayState;

        // The Adaptive Intervention
        if (predictedState === 'drowsy') {
            if (contentParagraphEl.textContent !== simpleText) {
                contentParagraphEl.textContent = simpleText;
                contentParagraphEl.style.color = '#007bff';
            }
        } else { // 'focused'
            if (contentParagraphEl.textContent !== originalText) {
                contentParagraphEl.textContent = originalText;
                contentParagraphEl.style.color = 'inherit';
            }
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

    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    generateFocusedBtn.addEventListener('click', () => { currentState = 'focused'; });
    generateDrowsyBtn.addEventListener('click', () => { currentState = 'drowsy'; });

    // --- AI TRAINING LOGIC ---
    const net = new brain.NeuralNetwork({ hiddenLayers: [4] });
    let isTrained = false;

    function trainModel() {
        console.log("Starting AI training...");
        cognitiveStateEl.textContent = "Training...";
        isTrained = false;

        const trainingData = [];
        const sampleSize = 5;
        const numSamples = 100;

        for (let i = 0; i < numSamples; i++) {
            const sample = [];
            for (let j = 0; j < sampleSize; j++) {
                sample.push(getMockEEGData('focused'));
            }
            trainingData.push({ input: sample, output: { focused: 1 } });
        }

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