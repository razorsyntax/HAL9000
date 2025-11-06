# Angular Usage Guide

## Installation

```bash
npm install hal9000js
```

## Basic Setup

### 1. Import in Component

```typescript
import { Component } from '@angular/core';
import { NeuralNetwork, NeuronArray, Prediction, Train } from 'hal9000js';

@Component({
  selector: 'app-neural-network',
  template: `
    <button (click)="train()">Train Network</button>
	@if(result){
    	<p>Error: {{ error }}</p>
    	<p>Prediction: {{ result }}</p>
	}
  `
})
export class NeuralNetworkComponent {
  result: number[] | null = null;
  error: number | null = null;

  train() {
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

    this.error = trainedNN.globalFinal;
    this.result = Prediction(trainedNN, inputs);
  }
}
```

### 2. Service Pattern (Recommended)

For better organization, create a service:

```typescript
import { Injectable } from '@angular/core';
import { NeuralNetwork, Train, Prediction, NeuronArray } from 'hal9000js';

@Injectable({
  providedIn: 'root'
})
export class NeuralNetworkService {
  private network: any = null;

  createNetwork() {
    const NN = new NeuralNetwork('MyNetwork');
    // ... setup layers ...
    return NN;
  }

  train(network: any, inputs: number[], rate: number, iterations: number) {
    return Train(network, inputs, rate, iterations, true);
  }

  predict(network: any, inputs: number[]) {
    return Prediction(network, inputs);
  }
}
```

## GPU Acceleration (Optional)

For browser GPU acceleration:

```bash
npm install gpu.js
```

```typescript
import { loadGPUBackend, setBackend } from 'hal9000js';

async ngOnInit() {
  await loadGPUBackend();
  setBackend('gpu'); // or 'auto'
}
```

## Complete Example

See `examples/angular/example.component.ts` for a complete working example.

