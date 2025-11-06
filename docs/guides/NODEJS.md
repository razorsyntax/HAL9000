# Node.js Usage Guide

## Installation

```bash
npm install hal9000js
```

## Basic Usage

### CommonJS

```javascript
const { NeuralNetwork, Train, Prediction, NeuronArray } = require('hal9000js');

// Create network
const NN = new NeuralNetwork('MyNetwork');
NN.createLayer({
    type: 'hidden',
    neurons: NeuronArray(5, 'logsig')
});
NN.createLayer({
    type: 'output',
    neurons: NeuronArray(3, 'logsig')
});

// Set targets and initialize
NN.setTarget([0.1, 0.9, 0.2]);
NN.init(3);

// Train
const inputs = [0.5, 0.3, 0.8];
const trainedNN = Train(NN, inputs, 0.5, 1000, true);

// Predict
const result = Prediction(trainedNN, inputs);
console.log('Prediction:', result);
```

### ES Modules

```javascript
import { NeuralNetwork, Train, Prediction, NeuronArray } from 'hal9000js';

// Same usage as CommonJS
```

## GPU Acceleration (Optional)

For GPU acceleration in Node.js, install TensorFlow.js:

```bash
npm install @tensorflow/tfjs-node
# or for GPU:
npm install @tensorflow/tfjs-node-gpu
```

Then load the backend:

```javascript
import { loadTensorFlowBackend, setBackend } from 'hal9000js';

// Load TensorFlow backend
await loadTensorFlowBackend();

// Use GPU backend
setBackend('tensorflow'); // or 'auto' to auto-detect
```

## Complete Example

See `examples/nodejs/example.js` for a complete working example.

