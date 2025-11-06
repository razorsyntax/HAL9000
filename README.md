# HAL9000

A JavaScript neural network library with hardware acceleration support for Node.js, Angular, React, and Vanilla JS.

## What is HAL9000?

HAL9000 is a lightweight, flexible neural network library designed for developers who want to build and train feedforward neural networks directly in JavaScript. Whether you're working on machine learning projects in the browser, Node.js applications, or modern web frameworks, HAL9000 provides a straightforward API for creating, training, and using neural networks.

**How HAL9000 Works:**

HAL9000 implements a complete neural network training system using two key algorithms:

- **Feedforward**: During training and prediction, data flows forward through the network layers (input → hidden → output), with each layer computing activations from the previous layer's outputs.

- **Backpropagation**: During training, HAL9000 uses the backpropagation algorithm to learn from errors. After each forward pass, it calculates the error between predictions and targets, then propagates this error backward through the network layers, computing gradients and updating weights to minimize the error.

The `Train()` function performs both feedforward and backpropagation in each training iteration, while `Prediction()` uses only feedforward to generate outputs from trained networks.

**Who is HAL9000 for?**
- **Web Developers** building ML-powered features in browsers or Node.js
- **Students and Educators** learning neural network fundamentals
- **Prototypers** who need quick neural network implementations without heavy dependencies
- **Developers** who want GPU acceleration without complex setup
- **Anyone** who prefers JavaScript/TypeScript over Python for their ML projects

HAL9000 focuses on simplicity and flexibility—you have full control over your network architecture, training process, and data handling, while optional GPU acceleration helps speed up training when available.

## Features

- 🧠 **Neural Network Engine**: Feedforward neural networks with backpropagation
- ⚡ **Hardware Acceleration**: Optional GPU support via GPU.js (browser) and TensorFlow.js (Node.js)
- 📦 **Multiple Formats**: ES Modules, CommonJS, and UMD builds
- 🎯 **Framework Agnostic**: Works with Node.js, Angular, React, and Vanilla JS
- 📚 **TypeScript Support**: Full TypeScript definitions included

## Requirements

- **Node.js**: >=14.0.0 (for Node.js usage)
- **Browsers**: Modern browsers with ES2015+ support (Chrome, Firefox, Safari, Edge)
- **GPU Acceleration** (optional): 
  - Browser: WebGL support for GPU.js
  - Node.js: CUDA/ROCm/Metal for TensorFlow.js GPU backend

## Supported Platforms & Frameworks

HAL9000 works across multiple environments:

- ✅ **Node.js** - CommonJS and ES Modules
- ✅ **React** - ES Modules with TypeScript support
- ✅ **Angular** - ES Modules with TypeScript support
- ✅ **Vanilla JavaScript** - UMD build for browsers (CDN or direct import)
- ✅ **TypeScript** - Full type definitions included

## Quick Start

### Installation

**npm:**
```bash
npm install hal9000js
```

**CDN (Browser):**
```html
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
```

### Basic Usage

```javascript
import { NeuralNetwork, Train, Prediction, NeuronArray } from 'hal9000js';

// Create network
const NN = new NeuralNetwork('MyNetwork');
NN.createLayer({
    type: 'hidden', // create hidden layer
    neurons: NeuronArray(5, 'logsig')
});
NN.createLayer({
    type: 'output', // create an output layer
    neurons: NeuronArray(3, 'logsig')
});

// Initialize and train
NN.setTarget([0.1, 0.9, 0.2]);
NN.init(3);
const trainedNN = Train(NN, [0.5, 0.3, 0.8], 0.5, 1000, true);

// Predict
const result = Prediction(trainedNN, [0.5, 0.3, 0.8]);
console.log('Prediction:', result);
```

## Documentation

- **[Installation Guide](docs/guides/INSTALLATION.md)** - Setup and installation
- **[API Reference](docs/api/API_REFERENCE.md)** - Complete API documentation
- **[Activation Functions Guide](docs/guides/ACTIVATION_FUNCTIONS.md)** - Understanding activation functions
- **[Framework Guides](docs/README.md)** - Framework-specific usage
- **[CDN Usage](docs/CDN_USAGE.md)** - Using HAL9000 via CDN

## Examples

See the `examples/` directory for complete, runnable examples:
- [Node.js Example](examples/nodejs/example.js)
- [Angular Example](examples/angular/example.component.ts)
- [React Example](examples/react/Example.tsx)
- [Vanilla JS Example](examples/vanilla/example.html)

## Hardware Acceleration

HAL9000 supports optional hardware acceleration for faster training:

- **Browser**: GPU.js with WebGL (automatic fallback to CPU if unavailable)
- **Node.js**: TensorFlow.js with CUDA/ROCm/Metal support

**To enable GPU acceleration:**

**Browser:**
```bash
npm install gpu.js
```

**Node.js:**
```bash
npm install @tensorflow/tfjs-node
# or for GPU:
npm install @tensorflow/tfjs-node-gpu
```

The library automatically detects and uses GPU acceleration if available, otherwise falls back to CPU. See [Checking GPU Status](docs/guides/CHECKING_GPU.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Demo**: [https://razorsyntax.github.io/HAL9000/](https://razorsyntax.github.io/HAL9000/)
- **GitHub**: [https://github.com/razorsyntax/HAL9000](https://github.com/razorsyntax/HAL9000)



## Future Work

The core neural network engine is complete and functional. The following features are being considered for future releases to enhance the developer experience and make HAL9000 a more complete end-to-end solution:

### Data Loading & Preprocessing
- **MNIST Dataset Loader**: Built-in function to load MNIST training/test datasets
- **Image Preprocessing Utilities**: Functions to convert images to normalized arrays, resize images, handle grayscale/RGB conversion
- **Data Augmentation**: Built-in image transformations (rotation, scaling, etc.) for training

### Training Enhancements
- **Batch Training**: Support for training on batches of examples rather than one-at-a-time
- **Early Stopping**: Automatically stop training when validation accuracy plateaus
- **Learning Rate Scheduling**: Adaptive learning rates that decrease over time
- **Training Callbacks**: Progress callbacks, epoch end hooks, custom metrics
- **Validation Split**: Automatic train/validation split during training

### Evaluation & Metrics
- **Accuracy Calculation**: Built-in accuracy, precision, recall metrics
- **Confusion Matrix**: Generate confusion matrices for classification tasks
- **Test/Validation Helpers**: Easy evaluation on separate test datasets

### Model Persistence
- **Save/Load API**: `NN.save('model.json')` and `NeuralNetwork.load('model.json')` methods
- **Model Versioning**: Track model versions and metadata
- **Format Validation**: Ensure loaded models are compatible

### Prediction Helpers
- **Class Prediction**: `predictDigit(NN, imageArray)` returns "5" instead of raw array `[0,0,0,0,0,1,0,0,0,0]`
- **Confidence Scores**: Helper to get confidence/probability for predictions
- **Top-K Predictions**: Get top N most likely classes

### Data Utilities
- **One-Hot Encoding**: Helper function to convert class labels to one-hot arrays
- **Data Normalization**: Built-in normalization/scaling utilities
- **Train/Test Split**: Utility to split datasets into training and testing sets

### Example: Potential Future API
```javascript
// Potential future API (not currently available)
import { loadMNIST, NeuralNetwork, train, evaluate, predictDigit } from 'hal9000';

// Load data
const { trainData, testData } = loadMNIST();

// Create and train network
const NN = new NeuralNetwork('MNIST');
// ... setup layers ...
train(NN, trainData, {
    epochs: 10,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: { onEpochEnd: (metrics) => console.log(metrics) }
});

// Evaluate
const accuracy = evaluate(NN, testData);
console.log(`Accuracy: ${accuracy}%`);

// Save model
NN.save('mnist-model.json');

// Predict
const digit = predictDigit(NN, imageArray); // Returns "5"
```
