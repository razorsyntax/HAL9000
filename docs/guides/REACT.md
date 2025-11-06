# React Usage Guide

## Installation

```bash
npm install hal9000js
```

## Basic Setup

### Functional Component Example

```tsx
import React, { useState } from 'react';
import { NeuralNetwork, NeuronArray, Prediction, Train } from 'hal9000js';

function NeuralNetworkComponent() {
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState<number | null>(null);

  const train = () => {
    const NN = new NeuralNetwork('MyNetwork');
    NN.createLayer({
      type: 'hidden',
      neurons: NeuronArray(5, 'logsig')
    });
    NN.createLayer({
      type: 'output',
      neurons: NeuronArray(3, 'logsig')
    });

    NN.setTarget([0.1, 0.9, 0.2]);
    NN.init(3);

    const inputs = [0.5, 0.3, 0.8];
    const trainedNN = Train(NN, inputs, 0.5, 1000, true);

    setError(trainedNN.globalFinal);
    setResult(Prediction(trainedNN, inputs));
  };

  return (
    <div>
      <button onClick={train}>Train Network</button>
      {result && (
        <div>
          <p>Error: {error}</p>
          <p>Prediction: {result.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default NeuralNetworkComponent;
```

### Custom Hook Pattern (Recommended)

```tsx
import { useState, useCallback } from 'react';
import { NeuralNetwork, Train, Prediction, NeuronArray } from 'hal9000js';

function useNeuralNetwork() {
  const [network, setNetwork] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);

  const createNetwork = useCallback(() => {
    const NN = new NeuralNetwork('MyNetwork');
    // ... setup layers ...
    setNetwork(NN);
    return NN;
  }, []);

  const train = useCallback(async (inputs: number[], rate: number, iterations: number) => {
    if (!network) return;
    setIsTraining(true);
    const trainedNN = Train(network, inputs, rate, iterations, true);
    setNetwork(trainedNN);
    setIsTraining(false);
    return trainedNN;
  }, [network]);

  const predict = useCallback((inputs: number[]) => {
    if (!network) return null;
    return Prediction(network, inputs);
  }, [network]);

  return { network, isTraining, createNetwork, train, predict };
}
```

## GPU Acceleration (Optional)

```bash
npm install gpu.js
```

```tsx
import { useEffect } from 'react';
import { loadGPUBackend, setBackend } from 'hal9000js';

useEffect(() => {
  loadGPUBackend().then(() => {
    setBackend('gpu'); // or 'auto'
  });
}, []);
```

## Complete Example

See `examples/react/Example.tsx` for a complete working example.

