// Node.js Example - CommonJS

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

