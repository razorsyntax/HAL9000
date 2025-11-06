/**
 * Test CommonJS Build
 * Run with: node test-cjs.js
 */

const { NeuralNetwork, Train, Prediction, NeuronArray } = require('../../dist/hal9000.cjs.js');

console.log('Testing CommonJS build...\n');

// Create network
const NN = new NeuralNetwork('TestNetwork');
NN.createLayer({
	type: 'hidden',
	neurons: NeuronArray(3, 'logsig')
});
NN.createLayer({
	type: 'output',
	neurons: NeuronArray(1, 'logsig')
});

NN.setTarget([0.8]);
NN.init(2);

// Train
const inputs = [0.5, 0.5];
const trainedNN = Train(NN, inputs, 0.5, 10, true);

console.log('✓ CommonJS build works!');
console.log('  Final error:', trainedNN.globalFinal);
console.log('  Prediction:', Prediction(trainedNN, inputs));

