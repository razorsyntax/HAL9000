# Vanilla JavaScript / Browser Usage Guide

## Installation Methods

### Option 1: CDN (Easiest)

```html
<!-- unpkg.com -->
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>

<!-- jsDelivr (alternative) -->
<script src="https://cdn.jsdelivr.net/npm/hal9000js@latest/dist/hal9000.umd.min.js"></script>

<script>
  const { NeuralNetwork, Train, Prediction, NeuronArray } = hal9000;
  // Use the library...
</script>
```

### Option 2: Download and Include

1. Download `hal9000.umd.js` or `hal9000.umd.min.js` from the `dist/` folder
2. Include in your HTML:

```html
<script src="./hal9000.umd.js"></script>
<script>
  const { NeuralNetwork, Train, Prediction, NeuronArray } = hal9000;
</script>
```

### Option 3: ES Modules (Modern Browsers)

```html
<script type="module">
  import { NeuralNetwork, Train, Prediction, NeuronArray } from './node_modules/hal9000js/dist/hal9000.esm.js';
  
  // Use the library...
</script>
```

## Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>HAL9000 Example</title>
</head>
<body>
  <button id="trainBtn">Train Network</button>
  <div id="results"></div>

  <script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
  <script>
    const { NeuralNetwork, Train, Prediction, NeuronArray } = hal9000;

    document.getElementById('trainBtn').addEventListener('click', function() {
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

      // Display results
      document.getElementById('results').innerHTML = 
        '<h2>Results</h2>' +
        '<p>Final Error: ' + trainedNN.globalFinal + '</p>' +
        '<p>Prediction: [' + result.join(', ') + ']</p>';
    });
  </script>
</body>
</html>
```

## GPU Acceleration (Optional)

For GPU acceleration in the browser, include GPU.js:

```html
<script src="https://unpkg.com/gpu.js@latest/dist/gpu-browser.min.js"></script>
<script src="https://unpkg.com/hal9000js@latest/dist/hal9000.umd.min.js"></script>
<script>
  const { loadGPUBackend, setBackend } = hal9000;
  
  // Load and use GPU backend
  loadGPUBackend().then(() => {
    setBackend('gpu'); // or 'auto'
  });
</script>
```

## Complete Example

See `examples/vanilla/example.html` for a complete working example.

